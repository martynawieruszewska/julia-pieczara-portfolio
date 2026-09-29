import json
from pathlib import Path

import openpyxl


ROOT = Path(__file__).resolve().parent.parent

excel_path = ROOT / "data" / "opinie.xlsx"
json_path = ROOT / "data" / "opinie.json"


workbook = openpyxl.load_workbook(excel_path, data_only=True)
sheet = workbook.active

headers = [cell.value for cell in sheet[1]]

required_columns = ["Opinia", "Imie", "Firma"]

for column in required_columns:
    if column not in headers:
        raise ValueError(f"Brakuje kolumny: {column}")

reviews = []

for row in sheet.iter_rows(min_row=2, values_only=True):
    row_data = dict(zip(headers, row))

    opinion = row_data.get("Opinia")
    name = row_data.get("Imie")
    company = row_data.get("Firma")

    if not opinion:
        continue

    reviews.append({
        "opinia": str(opinion).strip(),
        "imie": str(name).strip() if name else "",
        "firma": str(company).strip() if company else ""
    })


with open(json_path, "w", encoding="utf-8") as file:
    json.dump(reviews, file, ensure_ascii=False, indent=2)


print(f"Gotowe: wygenerowano {len(reviews)} opinii.")
print(f"Plik: {json_path}")