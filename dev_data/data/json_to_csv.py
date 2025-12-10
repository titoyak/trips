import json
import csv
import os

# Map MongoDB ObjectIds to Integer IDs
id_map = {}
current_id = 1

def get_int_id(mongo_id):
    global current_id
    if mongo_id not in id_map:
        id_map[mongo_id] = current_id
        current_id += 1
    return id_map[mongo_id]

def json_to_csv(json_file, csv_file):
    with open(json_file, 'r') as f:
        data = json.load(f)

    if not data:
        return

    # Pre-process data to replace ObjectIds with Integer IDs
    processed_data = []
    for item in data:
        new_item = item.copy()
        
        # Handle _id
        if '_id' in new_item:
            new_item['id'] = get_int_id(new_item['_id'])
            del new_item['_id']
        
        # Handle foreign keys (user, tour, guides)
        if 'user' in new_item and isinstance(new_item['user'], str):
             new_item['user_id'] = get_int_id(new_item['user'])
             del new_item['user']
        
        if 'tour' in new_item and isinstance(new_item['tour'], str):
             new_item['tour_id'] = get_int_id(new_item['tour'])
             del new_item['tour']
             
        if 'guides' in new_item and isinstance(new_item['guides'], list):
            # For many-to-many, we might need a separate table, but for now let's just keep the list of int IDs
            # Or if the CSV import expects a specific format. 
            # Since Supabase import is simple, let's just map them.
            # However, the guides field in tours.json is a list of IDs.
            # We probably shouldn't include 'guides' column in the tours table import if it's a relationship.
            # But let's map them anyway for reference.
            new_item['guides'] = [get_int_id(g) for g in new_item['guides']]

        processed_data.append(new_item)

    # Collect all keys from all items to ensure we have a complete header
    keys = set()
    for item in processed_data:
        keys.update(item.keys())
    
    header = sorted(list(keys))

    with open(csv_file, 'w', newline='', encoding='utf-8') as f:
        writer = csv.DictWriter(f, fieldnames=header)
        writer.writeheader()
        
        for item in processed_data:
            # Handle nested objects by converting them to JSON strings
            row = {}
            for key in header:
                value = item.get(key)
                if isinstance(value, (dict, list)):
                    row[key] = json.dumps(value)
                else:
                    row[key] = value
            writer.writerow(row)
    
    print(f"Converted {json_file} to {csv_file}")

def main():
    data_dir = os.path.dirname(os.path.abspath(__file__))
    # Process users first to establish IDs, then tours, then reviews
    files = ['users.json', 'tours.json', 'reviews.json']
    
    for file in files:
        json_path = os.path.join(data_dir, file)
        if os.path.exists(json_path):
            csv_path = os.path.join(data_dir, file.replace('.json', '.csv'))
            json_to_csv(json_path, csv_path)

if __name__ == "__main__":
    main()
