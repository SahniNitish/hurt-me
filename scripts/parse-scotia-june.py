#!/usr/bin/env python3
"""Scotia statement May 18–Jun 17, 2026 → Hurt Me budget JSON (May 19–31 + June)."""
import json
import subprocess
from pathlib import Path

PDF = Path("/home/nitish/.hermes/cache/documents/doc_4d31d2d137bb_Statements 2.pdf")
subprocess.check_output(["pdftotext", str(PDF), "-"])  # sanity

MAY_EXP = [
    ("2026-05-19", 66.51, "Transfer to credit card"),
    ("2026-05-19", 19.14, "Osmows Lower Sackville"),
    ("2026-05-19", 8.79, "Klarna"),
    ("2026-05-19", 50.00, "Interac e-Transfer"),
    ("2026-05-19", 30.00, "Transfer to credit card"),
    ("2026-05-19", 16.48, "McDonald's Moncton"),
    ("2026-05-19", 7.29, "Shoppers Drug Mart"),
    ("2026-05-19", 23.00, "ABM withdrawal"),
    ("2026-05-19", 2.00, "INTERAC ABM fee"),
    ("2026-05-19", 18.27, "McDonald's Dieppe"),
    ("2026-05-19", 20.00, "Interac e-Transfer"),
    ("2026-05-20", 10.00, "Transfer to credit card"),
    ("2026-05-20", 30.00, "Interac e-Transfer"),
    ("2026-05-21", 1.00, "Move Scooter Rental"),
    ("2026-05-21", 12.00, "Move Scooter Rental"),
    ("2026-05-22", 1.40, "Comewel Limited"),
    ("2026-05-22", 42.78, "DoorDash Mirchitando"),
    ("2026-05-23", 34.56, "Klarna Walmart"),
    ("2026-05-23", 33.15, "Klarna Walmart"),
    ("2026-05-23", 4.32, "Comewel Limited"),
    ("2026-05-23", 34.04, "Klarna"),
    ("2026-05-23", 17.99, "Interac e-Transfer"),
    ("2026-05-25", 15.96, "Tim Hortons Moncton"),
    ("2026-05-25", 9.00, "Interac e-Transfer"),
    ("2026-05-25", 34.00, "SkipTheDishes"),
    ("2026-05-25", 21.09, "SkipTheDishes"),
    ("2026-05-26", 6.50, "Tim Hortons Moncton"),
    ("2026-05-26", 12.00, "Move Scooter Rental"),
    ("2026-05-26", 23.00, "ABM withdrawal"),
    ("2026-05-26", 2.00, "INTERAC ABM fee"),
    ("2026-05-28", 176.51, "Bell Mobility"),
    ("2026-05-28", 66.71, "Sobeys Moncton"),
    ("2026-05-28", 10.00, "Transfer to credit card"),
    ("2026-05-28", 2.35, "Etsy StitchEasyStudio"),
    ("2026-05-28", 12.70, "Klarna"),
    ("2026-05-29", 13.65, "Tim Hortons Moncton"),
    ("2026-05-29", 121.98, "Besharam Bar Halifax"),
    ("2026-05-30", 36.62, "Sq Momonepal Wolfville"),
    ("2026-05-30", 10.78, "Healthy Lemon's Wolfville"),
    ("2026-05-30", 18.67, "KFC Pizza Hut New Minas"),
    ("2026-05-30", 36.27, "Victor Cuts Kentville"),
    ("2026-05-30", 5.00, "Shell New Minas"),
    ("2026-05-30", 59.00, "Interac e-Transfer"),
]

MAY_INC = [
    ("2026-05-20", 174.96, "Irving Consumer Products"),
    ("2026-05-21", 5.70, "Borrowell payroll"),
    ("2026-05-23", 33.15, "Error correction Klarna Walmart"),
    ("2026-05-23", 34.56, "Error correction Klarna Walmart"),
    ("2026-05-23", 20.00, "Interac e-Transfer deposit"),
    ("2026-05-25", 20.00, "Interac e-Transfer deposit"),
    ("2026-05-25", 100.00, "Interac e-Transfer deposit"),
    ("2026-05-26", 7.00, "Interac e-Transfer deposit"),
    ("2026-05-28", 2192.88, "J.D. Irving payroll"),
    ("2026-05-29", 5.70, "Borrowell payroll"),
]

JUN_EXP = [
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

JUN_INC = [
    ("2026-06-02", 200.00, "Interac e-Transfer deposit"),
    ("2026-06-03", 200.00, "Interac e-Transfer deposit"),
    ("2026-06-04", 5.70, "Borrowell payroll"),
    ("2026-06-08", 100.00, "Interac e-Transfer deposit"),
    ("2026-06-11", 1467.69, "J.D. Irving payroll"),
]


def cat_fix(note: str) -> str:
    n = note.lower()
    if "doordash" in n or "skip" in n or "osmows" in n:
        return "Food"
    if "anthropic" in n or "grok" in n or "xai" in n or "amazon prime" in n or "youtube" in n:
        return "Subscriptions"
    if "bell" in n:
        return "Subscriptions"
    if "instacart" in n or any(
        x in n
        for x in (
            "tim hortons",
            "mcdonald",
            "sobeys",
            "costco",
            "walmart",
            "dairy",
            "villa",
            "madras",
            "areum",
            "spice",
            "canasian",
            "shoppers",
            "kfc",
            "pizza",
            "healthy lemon",
            "momonepal",
        )
    ):
        return "Food"
    if "shell" in n or "poparide" in n or "scooter" in n:
        return "Transport"
    if "cineplex" in n or "liquor" in n or "besharam" in n or "bar halifax" in n:
        return "Fun"
    if "victor cuts" in n:
        return "Other"
    if "credit card" in n or "e-transfer" in n or "abm" in n or "cnb" in n or "remitly" in n or "blinkit" in n or "etsy" in n or "usat" in n or "comewel" in n:
        return "Other"
    if "klarna" in n:
        return "Other"
    if "error correction" in n or "payroll" in n or "deposit" in n or "irving consumer" in n:
        return "Other"
    return "Other"


def pack(tag: str, rows_exp, rows_inc):
    out = []
    i = 0
    for date, amt, note in rows_exp:
        out.append(
            {
                "id": f"{tag}-{date}-{i}",
                "date": date,
                "amount": round(amt, 2),
                "category": cat_fix(note),
                "type": "expense",
                "note": f"Scotia: {note}",
            }
        )
        i += 1
    for date, amt, note in rows_inc:
        out.append(
            {
                "id": f"{tag}-{date}-{i}",
                "date": date,
                "amount": round(amt, 2),
                "category": "Other",
                "type": "income",
                "note": f"Scotia: {note}",
            }
        )
        i += 1
    return out


def write(path: Path, rows):
    path.write_text(json.dumps(rows, indent=2))
    exp = sum(r["amount"] for r in rows if r["type"] == "expense")
    inc = sum(r["amount"] for r in rows if r["type"] == "income")
    print(path.name, len(rows), f"exp ${exp:.2f}", f"inc ${inc:.2f}")


base = Path("/home/nitish/hurt-me/src/data")
base.mkdir(parents=True, exist_ok=True)

# June file keeps legacy ids (no id in json before - built in ts). Regenerate june without id in json for ts builder
june = []
for date, amt, note in JUN_EXP:
    june.append({"date": date, "amount": round(amt, 2), "category": cat_fix(note), "type": "expense", "note": f"Scotia: {note}"})
for date, amt, note in JUN_INC:
    june.append({"date": date, "amount": round(amt, 2), "category": "Other", "type": "income", "note": f"Scotia: {note}"})
write(base / "scotia-june-2026.json", june)

may = pack("scotia-may-2026", MAY_EXP, MAY_INC)
write(base / "scotia-may-2026.json", may)