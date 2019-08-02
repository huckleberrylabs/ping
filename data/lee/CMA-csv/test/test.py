import os
import pandas as pd
from pandas import DataFrame
import numpy as np

cma = pd.read_csv('../cma.csv')
test = pd.read_csv('./Member Single Line Sold.csv')

test_n = len(test)
success_count = 0
error_bin = []
other_bin = []


for i in range(test_n):
    test_id = test.iloc[i]['MLS']
    cma_line = cma[cma['MLS #'] == test_id]
    if len(cma_line) == 1:
        if (cma_line['Sold Price'] == test.iloc[i]['Sold Price']).bool():
            success_count = success_count + 1
        else:
            error_bin.append(test_id)
    else:
        other_bin.append(test_id)

success_rate = "{0:.0%}".format(success_count/float(test_n))
error_rate = "{0:.0%}".format(len(error_bin)/float(test_n))
other_rate = "{0:.0%}".format(len(other_bin)/float(test_n))

print("Success Rate: %s" % (str(success_rate)))
print("Error Rate: %s" % (str(error_rate)))
print("Excluded Rate: %s" % (str(other_rate)))

print("Error ids: %s" % (error_bin))
print("Excluded ids: %s" % (other_bin))
