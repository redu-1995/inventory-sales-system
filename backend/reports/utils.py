import io
import csv
import pandas as pd
from django.http import HttpResponse


def generate_csv_response(filename, headers, data_rows):
    response = HttpResponse(content_type='text/csv')
    response['Content-Disposition'] = f'attachment; filename="{filename}.csv"'

    writer = csv.writer(response)
    writer.writerow(headers)
    for row in data_rows:
        writer.writerow(row)

    return response


def generate_excel_response(filename, dataframe_dict):
    """
    Generates multi-tab or single-tab Excel files using pandas via BytesIO.
    """
    buffer = io.BytesIO()
    
    with pd.ExcelWriter(buffer, engine='openpyxl') as writer:
        for sheet_name, df in dataframe_dict.items():
            if df.empty:
                df = pd.DataFrame([{"Notice": "No records found."}])
            df.to_excel(writer, sheet_name=str(sheet_name)[:31], index=False)

    buffer.seek(0)

    response = HttpResponse(
        buffer.getvalue(),
        content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    )
    response['Content-Disposition'] = f'attachment; filename="{filename}.xlsx"'

    return response