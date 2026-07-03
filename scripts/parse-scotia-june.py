#!/usr/bin/env python3
"""Parse Scotia statement text → June 2026 expense JSON for Hurt Me."""
import json
import re
import subprocess
from pathlib import Path

PDF = Path("/home/nitish/.hermes/cache/documents/doc_4d31d2d137bb_Statements 2.pdf")
text = subprocess.check_output(["pdftotext", str(PDF), "-"], text="utf-8", errors="replace")

# Manual curated June 1–17 expenses from statement (amounts verified against running balances)
# Format: (month_day, amount, note)
RAW = [
    ("2026-06-01", 14.23, "McDonald's New Minas"),
    ("2026-06-01", 6.66, "Tim Hortons Moncton"),
    ("2026-06-01", 10.00, "Interac e-Transfer"),
    ("2026-06-01", 10.53, "Sobeys Moncton"),
    ("2026-06-01", 31.96, "Shoppers Drug Mart"),
    ("2026-06-01", 24.88, "DoorDash Himalayan"),
    ("2026-06-01", 12.00, "Interac e-Transfer"),
    ("2026-06-01", 7.10, "Shell"),
    ("2026-06-01", 999.00, "Interac e-Transfer"),
    ("2026-06-01", 8.80, "Klarna"),
    ("2026-06-02", 9.64, "Tim Hortons"),
    ("2026-06-02", 13.89, "Tim Hortons"),
    ("2026-06-02", 12.56, "Costco Moncton"),
    ("2026-06-02", 299.97, "Costco Wholesale"),
    ("2026-06-03", 112.00, "Bell Aliant"),
    ("2026-06-04", 22.80, "Anthropic"),
    ("2026-06-04", 50.00, "Interac e-Transfer"),
    ("2026-06-05", 1.85, "Usat"),
    ("2026-06-05", 11.40, "Anthropic"),
    ("2026-06-05", 11.40, "Anthropic"),
    ("2026-06-05", 16.00, "CNB ATM Moncton"),
    ("2026-06-05", 13.79, "Villa Madina Dieppe"),
    ("2026-06-06", 16.00, "CNB Moncton"),
    ("2026-06-06", 11.95, "McDonald's Moncton"),
    ("2026-06-06", 3.99, "Etsy Daughters Care"),
    ("2026-06-08", 33.24, "Areum's Sweet Recipe"),
    ("2026-06-08", 2.31, "Cineplex Moncton"),
    ("2026-06-08", 32.45, "Instacart (Klarna)"),
    ("2026-06-08", 105.79, "Remitly"),
    ("2026-06-08", 10.00, "Interac e-Transfer"),
    ("2026-06-11", 10.11, "Tim Hortons"),
    ("2026-06-11", 24.50, "ABM withdrawal"),
    ("2026-06-11", 2.00, "INTERAC ABM fee"),
    ("2026-06-12", 12.71, "Klarna Poparide"),
    ("2026-06-12", 3.67, "Tim Hortons"),
    ("2026-06-12", 12.28, "Dairy Queen"),
    ("2026-06-12", 46.07, "Sobeys"),
    ("2026-06-12", 21.77, "NB Liquor"),
    ("2026-06-13", 43.74, "Walmart Dieppe"),
    ("2026-06-13", 16.00, "CNB Moncton"),
    ("2026-06-13", 43.89, "Spice Shop Dieppe"),
    ("2026-06-13", 28.58, "Blinkit"),
    ("2026-06-13", 14.40, "Grok xAI"),
    ("2026-06-15", 11.39, "Amazon Prime"),
    ("2026-06-15", 67.19, "Madras Cafe"),
    ("2026-06-15", 14.60, "Lost Found Moncton"),
    ("2026-06-15", 50.00, "Transfer to credit card"),
    ("2026-06-15", 11.12, "Canasian Market"),
    ("2026-06-15", 21.47, "McDonald's"),
    ("2026-06-15", 2.27, "YouTube Premium"),
    ("2026-06-15", 58.21, "DoorDash Gujral's"),
    ("2026-06-15", 27.93, "DoorDash Flavors Spot"),
    ("2026-06-15", 8.80, "DoorDash (Klarna)"),
    ("2026-06-16", 22.82, "DoorDash Gujral's"),
    ("2026-06-16", 13.96, "DoorDash McDonald's"),
    ("2026-06-17", 100.00, "Transfer to credit card"),
    ("2026-06-17", 8.83, "Tim Hortons"),
    ("2026-06-17", 13.00, "Interac e-Transfer"),
]

INCOME = [
    ("2026-06-02", 200.00, "Interac e-Transfer deposit"),
    ("2026-06-03", 200.00, "Interac e-Transfer deposit"),
    ("2026-06-04", 5.70, "Borrowell payroll"),
    ("2026-06-08", 100.00, "Interac e-Transfer deposit"),
    ("2026-06-11", 1467.69, "J.D. Irving payroll"),
]


def categorize(note: str) -> str:
    n = note.lower()
    if any(x in n for x in ("doordash", "tim hortons", "mcdonald", "sobeys", "costco", "walmart", "dairy queen", "villa madina", "madras", "areum", "spice shop", "canasian", "shoppers", "instacart", "kfc", "pizza", "osmows", "skip")):
        return "Food"
    if any(x in n for x in ("shell", "poparide", "scooter")):
        return "Transport"
    if any(x in n for x in ("anthropic", "grok", "xai", "amazon prime", "youtube", "bell", "klarna") and "doordash" not in n):
        if "klarna" in n and "doordash" not in n and "instacart" not in n and "poparide" not in n and "walmart" not in n:
            return "Other"
        return "Subscriptions"
    if any(x in n for x in ("anthropic", "grok", "amazon prime", "youtube", "bell aliant", "bell mobility")):
        return "Subscriptions"
    if any(x in n for x in ("cineplex", "liquor", "bar")):
        return "Fun"
    if any(x in n for x in ("irving payroll", "borrowell", "payroll", "deposit")):
        return "Other"
    if any(x in n for x in ("etsy",)):
        return "Other"
    if any(x in n for x in ("remitly", "blinkit", "transfer", "interac", "abm", "cnb", "usat")):
        return "Other"
    return "Other"


def cat_fix(note: str) -> str:
    n = note.lower()
    if "doordash" in n or "klarna" in n and "doordash" in n:
        return "Food"
    if "anthropic" in n or "grok" in n or "xai" in n:
        return "Subscriptions"
    if "amazon prime" in n or "youtube" in n:
        return "Subscriptions"
    if "bell" in n:
        return "Subscriptions"
    if "instacart" in n:
        return "Food"
    if "poparide" in n:
        return "Transport"
    if "credit card" in n or "e-transfer" in n or "abm" in n or "cnb" in n or "remitly" in n or "blinkit" in n or "etsy" in n or "usat" in n:
        return "Other"
    if any(x in n for x in ("tim hortons", "mcdonald", "sobeys", "costco", "walmart", "dairy", "villa", "madras", "areum", "spice", "canasian", "shoppers")):
        return "Food"
    if "shell" in n:
        return "Transport"
    if "cineplex" in n or "liquor" in n:
        return "Fun"
    if "klarna" in n and "doordash" not in n:
        return "Other"
    return "Other"


entries = []
for date, amt, note in RAW:
    entries.append({
        "date": date,
        "amount": round(amt, 2),
        "category": cat_fix(note),
        "type": "expense",
        "note": f"Scotia: {note}",
    })
for date, amt, note in INCOME:
    entries.append({
        "date": date,
        "amount": round(amt, 2),
        "category": "Other",
        "type": "income",
        "note": f"Scotia: {note}",
    })

out = Path("/home/nitish/hurt-me/src/data/scotia-june-2026.json")
out.parent.mkdir(parents=True, exist_ok=True)
out.write_text(json.dumps(entries, indent=2))
exp = sum(e["amount"] for e in entries if e["type"] == "expense")
inc = sum(e["amount"] for e in entries if e["type"] == "income")
print(f"entries {len(entries)} expenses ${exp:.2f} income ${inc:.2f} net ${inc-exp:.2f}")