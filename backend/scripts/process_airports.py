"""
Processes OurAirports airports.csv to extract commercial airports with IATA codes,
coordinates, cities, and countries.
"""

import os
import pandas as pd
import json

RAW_AIRPORTS = os.path.join(os.path.dirname(__file__), "..", "data", "raw", "airports.csv")
PROCESSED_DIR = os.path.join(os.path.dirname(__file__), "..", "data", "processed")
os.makedirs(PROCESSED_DIR, exist_ok=True)

def process_airports():
    print(f"Reading {RAW_AIRPORTS}...")
    df = pd.read_csv(
        RAW_AIRPORTS,
        usecols=["iata_code", "name", "type", "municipality", "iso_country", "latitude_deg", "longitude_deg", "elevation_ft"],
        low_memory=False
    )
    
    # Filter for valid IATA code (3 letters) and commercial/scheduled airports
    df = df[df["iata_code"].notna() & (df["iata_code"].str.len() == 3)]
    df = df[df["type"].isin(["large_airport", "medium_airport", "small_airport"])]
    df["iata_code"] = df["iata_code"].str.upper()
    df["municipality"] = df["municipality"].fillna(df["name"])
    
    # Remove duplicates by iata_code keeping large airports first
    type_priority = {"large_airport": 1, "medium_airport": 2, "small_airport": 3}
    df["priority"] = df["type"].map(type_priority).fillna(4)
    df = df.sort_values(by="priority").drop_duplicates(subset=["iata_code"])
    df = df.drop(columns=["priority"])
    
    print(f"Total valid IATA airports: {len(df)}")
    
    # Save parquet
    parquet_path = os.path.join(PROCESSED_DIR, "airports.parquet")
    df.to_parquet(parquet_path, index=False)
    print(f"Saved {parquet_path}")
    
    # Top airports for fast frontend search autocomplete
    # Focus on US major hubs + Top global + Top Indian hubs
    indian_iatas = ["DEL", "BOM", "BLR", "HYD", "MAA", "CCU", "AMD", "COK", "GOI", "PNQ", "JAI", "LKO", "IXC", "ATQ", "PAT", "IXB", "TRV", "VNS", "SXR", "GAU"]
    
    # Ensure Indian hubs are highlighted
    lite_list = []
    for _, row in df.iterrows():
        is_in = row["iso_country"] == "IN" or row["iata_code"] in indian_iatas or row["iso_country"] == "US" or row["type"] == "large_airport"
        if is_in:
            lite_list.append({
                "iata": row["iata_code"],
                "name": row["name"],
                "city": str(row["municipality"]),
                "country": str(row["iso_country"]),
                "lat": float(row["latitude_deg"]),
                "lon": float(row["longitude_deg"]),
                "is_india": row["iso_country"] == "IN" or row["iata_code"] in indian_iatas
            })
            
    json_path = os.path.join(PROCESSED_DIR, "airports_lite.json")
    with open(json_path, "w", encoding="utf-8") as f:
        json.dump(lite_list, f)
    print(f"Saved {len(lite_list)} airports to {json_path}")

if __name__ == "__main__":
    process_airports()
