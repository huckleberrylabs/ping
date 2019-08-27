import os
import pandas as pd
from pandas import DataFrame
import numpy as np


colum_names = ['MLS #', 'Address', 'City', '# Bed', '# Bth', 'Yr Blt', 'Acres',
               'SqFt', '$/SqFt', 'List Price', 'Sold Price', 'Sale Date', 'SP%LP', 'DOM']

file_numbers = 25

file_names = ['Jan1,012-June5,012.xlsx',  'Jan1,018une5,018.xlsx',    'June16,011-ec1,011.xlsx',   'June2,010ec5,010.xlsx', 'Dec16-31,010.xlsx',
              'Jan1,014une0,014.xlsx',    'Jan1,019uly0,019.xlsx',    'June16,012-Dec1,012.xlsx',  'May16,017-ct,017.xlsx', 'Dec2,018-ec1,018.xlsx',
              'Jan1,009-June0,009.xlsx',  'Jan1,015-une5,015.xlsx',   'Jan2013une5,013.xlsx',     'June16,015-ec,015.xlsx',    'May31,016-Oct5,016.xlsx',
              'Jan1,010-une,010.xlsx',    'Jan1,016ay0,016.xlsx',     'July1,009-Dec1,009.xlsx',  'June16,018ec,018.xlsx',     'Oct16,016-Dec1,016.xlsx',
              'Jan1,011-une5,011.xlsx',   'Jan1,017-ay5,017.xlsx',    'July1,014-ec1,014.xlsx',   'June16013-ec1,013.xlsx',    'Oct2,017-ec1,017.xlsx']
file_lines = [
    [73, 2], [75, 26], [71, 17], [75, 8], [3, 4],
    [75, 6], [64, 25], [69, 21], [71, 21], [7, 0],
    [75, 28], [73, 22], [71, 0], [74, 19], [74, 13],
    [70, 25], [75, 4], [74, 31], [73, 31], [31, 22],
    [71, 11], [73, 20], [71, 17], [72, 5], [33, 0]
]

dic = {'Unnamed: 0': 'delete', 'Unnamed: 1': 'MLS #', 'Unnamed: 2': 'Address', 'Unnamed: 3': 'City', 'Unnamed: 6': 'Yr Blt', 'Unnamed: 7': 'Acres',
       'Unnamed: 8': 'SqFt', 'Unnamed: 9': '$/SqFt', 'Unnamed: 10': 'List Price', 'Unnamed: 11': 'Sold Price', 'Unnamed: 12': 'Sale Date', 'Unnamed: 13': 'SP%LP', 'Unnamed: 14': 'DOM'}

print('Data Extraction and Cleaning Started:')

cma = pd.DataFrame(columns=colum_names)
for xlsx_file in range(file_numbers):
    print('  - ' + file_names[xlsx_file] + ' --> ' + file_names[xlsx_file].split(
        '.')[0] + '.csv ... (' + str(xlsx_file+1) + '/' + str(file_numbers) + ')'),
    # set local vars
    file_path = './CMA-csv/xlsx/' + file_names[xlsx_file]
    full_pages = file_lines[xlsx_file][0]
    trailing_lines = file_lines[xlsx_file][1]

    # head
    temp_head = pd.read_excel(file_path, sheet_name="1")
    temp_head_0 = temp_head.iloc[0]
    df = temp_head.iloc[6:36]

    if 'Unnamed: 4' in temp_head_0:
        df = df.rename(
            columns={'Unnamed: 4': '# Bed', 'CMA 1 - Line': '# Bth'})
    else:
        df = df.rename(
            columns={'CMA 1 - Line': '# Bed', 'Unnamed: 5': '# Bth'})

    df.index = range(30)

    # body
    for i in range(2, full_pages+1):
        temp_body = pd.read_excel(file_path, sheet_name=str(i))
        temp_body_0 = temp_body.iloc[0]
        df_body = temp_body.iloc[4:37]

        if 'Unnamed: 4' in temp_body_0:
            df_body = df_body.rename(
                columns={'Unnamed: 4': '# Bed', 'CMA 1 - Line': '# Bth'})
        else:
            df_body = df_body.rename(
                columns={'CMA 1 - Line': '# Bed', 'Unnamed: 5': '# Bth'})

        df = df.append(df_body, ignore_index=True, sort=False)

    # tail
    if trailing_lines > 0:
        temp_tail = pd.read_excel(file_path, sheet_name=str(full_pages+1))
        temp_tail_0 = temp_tail.iloc[0]
        df_tail = temp_tail.iloc[4:4+trailing_lines]

        if 'Unnamed: 4' in temp_tail_0:
            df_tail = df_tail.rename(
                columns={'Unnamed: 4': '# Bed', 'CMA 1 - Line': '# Bth'})
        else:
            df_tail = df_tail.rename(
                columns={'CMA 1 - Line': '# Bed', 'Unnamed: 5': '# Bth'})

        df = df.append(df_tail, ignore_index=True, sort=False)

    #format & export
    output_path = './CMA-csv/csv/' + \
        file_names[xlsx_file].split('.')[0] + '.csv'
    df = df.rename(columns=dic)
    df = df.drop(columns=['delete'])
    df.to_csv(output_path)
    cma = cma.append(df, ignore_index=True, sort=False)
    print(' completed')
cma.to_csv('./CMA-csv/cma.csv')
print('All ' + str(file_numbers) +
      ' csv files are cleaned and saved in CMA-csv/csv/ folder')
print('Merged result: cma.csv')
