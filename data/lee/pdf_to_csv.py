import pdftables_api

# third party service pdftables

my_api_key = "93m7snfwan3k"
c = pdftables_api.Client(my_api_key)
c.csv('./CMA-raw/Dec 16-31, 2010.pdf', './CMA-csv/Dec 16-31, 2010.pdf')
