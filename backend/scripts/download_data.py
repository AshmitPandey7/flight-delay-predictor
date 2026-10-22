"""
Script to download real datasets:
1. OurAirports airports.csv
2. US BTS On-Time Performance data (2023)
3. DGCA India official monthly OTP statistics
"""

import os
import sys
import time
import urllib.request
import zipfile
import shutil
import pandas as pd

RAW_DIR = os.path.join(os.path.dirname(__file__), "..", "data", "raw")
PROCESSED_DIR = os.path.join(os.path.dirname(__file__), "..", "data", "processed")
os.makedirs(RAW_DIR, exist_ok=True)
os.makedirs(PROCESSED_DIR, exist_ok=True)

def download_file_chunked(url, dest_path, desc=""):
    print(f"Downloading {desc} from {url}...")
    headers = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"}
    req = urllib.request.Request(url, headers=headers)
    
    with urllib.request.urlopen(req, timeout=60) as resp, open(dest_path, "wb") as out_file:
        total_size = int(resp.headers.get("Content-Length", 0))
        downloaded = 0
        chunk_size = 64 * 1024  # 64 KB
        start_time = time.time()
        
        while True:
            chunk = resp.read(chunk_size)
            if not chunk:
                break
            out_file.write(chunk)
            downloaded += len(chunk)
            if total_size > 0 and (time.time() - start_time) > 2:
                pct = (downloaded / total_size) * 100
                print(f"  {desc}: {downloaded / (1024*1024):.1f} MB / {total_size / (1024*1024):.1f} MB ({pct:.1f}%)")
                start_time = time.time()
                
    print(f"Finished {desc}: {os.path.getsize(dest_path)} bytes saved to {dest_path}")
    return dest_path

def download_ourairports():
    dest = os.path.join(RAW_DIR, "airports.csv")
    if os.path.exists(dest) and os.path.getsize(dest) > 1000000:
        print("OurAirports airports.csv already exists.")
        return dest
    url = "https://davidmegginson.github.io/ourairports-data/airports.csv"
    return download_file_chunked(url, dest, "OurAirports Database")

def download_bts_2023():
    # BTS Monthly Reporting Carrier On-Time Performance (transtats.bts.gov)
    # Month 1 (Jan 2023) has winter weather, snow, de-icing delays, cancellations (~550,000 commercial flights)
    # Month 6 (Jun 2023) has summer thunderstorms
    # Month 12 (Dec 2023) has winter holiday peak & winter fog
    dest_zip = os.path.join(RAW_DIR, "bts_2023_01.zip")
    if os.path.exists(dest_zip) and os.path.getsize(dest_zip) > 10000000:
        print("BTS 2023 Zip already exists.")
        return dest_zip
    url = "https://transtats.bts.gov/PREZIP/On_Time_Reporting_Carrier_On_Time_Performance_1987_present_2023_1.zip"
    return download_file_chunked(url, dest_zip, "BTS 2023 Jan Flights")

if __name__ == "__main__":
    download_ourairports()
    download_bts_2023()
