#!/usr/bin/python
import soup
import pandas as pd
import h5py
import requests  # get the requsts library from https://github.com/requests/requests
import xml.etree.ElementTree as et
from bs4 import BeautifulSoup

import csv

df = pd.read_csv('./data/1_Spatial_dataset.csv')
print(list(df._info_axis))

header = list(df._info_axis)


with open('predicted_pollution.csv', mode='w') as csvfile:
    wr = csv.writer(csvfile, delimiter=',', quotechar='"', quoting=csv.QUOTE_MINIMAL)
    wr.writerow([h for h in header])
    for i in range(len(results)):
        wr.writerow(results[i])
    outfile1.close()


username = "maryhpd"

password = "Mari22800"
# assuming variables `username`, `password` and `url` are set...

# Example URL

# url = "https://acdisc.gesdisc.eosdis.nasa.gov/data/Aura_OMI_Level3/OMNO2d.003/2019/"
url = "https://acdisc.gesdisc.eosdis.nasa.gov/data/Aura_OMI_Level3/OMNO2d.003/2019/"
      #'OMI-Aura_L3-OMNO2d_2019m0101_v003-2019m0104t122852.he5"

# url = "https://e4ftl01.cr.usgs.gov/MOTA/MCD43A2.006/2017.09.04/"

with requests.Session() as session:
    session.auth = (username, password)

    r1 = session.request('get', url)

    r = session.get(r1.url, auth=(username, password))

    if r.ok:
        print(r.content)  # Say


# soup= BeautifulSoup(r.content, "lxml")
# links=[]
# for link in soup.find_all("a"):
#     with h5py.File(url+link.get('href'), mode='r') as f:
#         # List available datasets.
#         print(f.keys())
#     link.get('href')
#     link.get('href')
#        links.append(link.get('href'))



# soup = BeautifulSoup(self.driver.page_source, "html.parser")
    # xtree = et.parse(r.content)
    # xroot = xtree.getroot()
    # rows = []
    #
    # for node in xroot:
    #     res = []
    #     res.append(node.attrib.get(df_cols[0]))
    #     for el in df_cols[1:]:
    #         if node is not None and node.find(el) is not None:
    #             res.append(node.find(el).text)
    #         else:
    #             res.append(None)
    #     rows.append({df_cols[i]: res[i]
    #                  for i, _ in enumerate(df_cols)})
    #
    # out_df = pd.DataFrame(rows, columns=df_cols)
    #
    #
    #
    #
    #




# create session with the user credentials that will be used to authenticate access to the data

username = "marishpd"

password = "Mari22800"

session = SessionWithHeaderRedirection(username, password)

# the url of the file we wish to retrieve

# url = "http://e4ftl01.cr.usgs.gov/MOLA/MYD17A3H.006/2009.01.01/MYD17A3H.A2009001.h12v05.006.2015198130546.hdf.xml"
# url = "https://acdisc.gesdisc.eosdis.nasa.gov/data/Aqua_AIRS_Level3/AIRX3STD.006/2016/AIRS.2016.01.01.L3.RetStd001.v6.0.31.0.G16004140142.hdf"
url ="https://acdisc.gesdisc.eosdis.nasa.gov/data/Aqua_AIRS_Level3/AIRX3STD.006/2016/AIRS.2016.01.01.L3.RetStd001.v6.0.31.0.G16004140142.hdf.map.gz"
# extract the filename from the url to be used when saving the file

filename = url[url.rfind('/') + 1:]

try:

    # submit the request using the session

    response = session.get(url, stream=True)

    print(response.status_code)

    # raise an exception in case of http errors

    response.raise_for_status()

    # save the file

    with open(filename, 'wb') as fd:

        for chunk in response.iter_content(chunk_size=1024 * 1024):
            fd.write(chunk)



except requests.exceptions.HTTPError as e:

    # handle any errors here

    print(e)