
import numpy as np
import h5py
import pandas as pd

FILE_NAME = '/home/maryam/Downloads/OMPS-NPP_NMTO3-L2-NRT_v2.1_2019m1011t235700_o41224_2019m1012t012024.h5'
with h5py.File(FILE_NAME, mode='r') as f:
    # List available datasets.
    print(f.keys())
    ScienceData=f['ScienceData'] #'/ScienceData/UVAerosolIndex' 400*36
    UVAerosolIndex = np.array(ScienceData['UVAerosolIndex']).reshape(14400)

    O3BelowCloud = np.array(ScienceData['O3BelowCloud']).reshape(14400)
    GeolocationData   =f['GeolocationData']
    Latitude, Longitude=np.array(GeolocationData['Latitude']).reshape(14400),  np.array(GeolocationData['Longitude']).reshape(14400)

df = pd.DataFrame({'Latitude': Latitude, 'Longitude': Longitude , 'O3BelowCloud': O3BelowCloud , 'UVAerosolIndex': UVAerosolIndex})
df.to_pickle('./data/UVAerosolIndex.pkl')
df.to_csv(r'./data/UVAerosolIndex.csv')
# /home/maryam/aura/data/allData/61/MYD04_L2/2019/284/MYD04_L2.A2019284.2355.061.NRT.hdf
#
# print('hi')
#     # Read dataset.
#     # dset = f[DATAFIELD_NAME]
#     # data = dset[:]
#     #
#     # # Handle fill value.
#     # data[data == dset.fillvalue] = np.nan
#     # data = np.ma.masked_where(np.isnan(data), data)
#     #
#     # # Get attributes needed for the plot.
#     # # String attributes actually come in as the bytes type and should
#     # # be decoded to UTF-8 (python3).
#     # title = dset.attrs['Title'].decode()
#     # units = dset.attrs['Units'].decode()
#
#
# # import os
# # import matplotlib as mpl
# # import matplotlib.pyplot as plt
# # from mpl_toolkits.basemap import Basemap
# import numpy as np
# import h5py
# import pandas as pd
#
# from os import listdir
# from os.path import isfile, join
# # from pyhdf.SD import SD, SDC
#
# # Open file.
# # mypath ='/Users/jdoe/data/allData/61/MYD04_L2/2019/284'
# # onlyfiles = [f for f in listdir(mypath) if isfile(join(mypath, f))]
#
# FILE_NAME = '/home/maryam/Downloads/OMPS-NPP_NMTO3-L2-NRT_v2.1_2019m1011t235700_o41224_2019m1012t012024.h5'
# with h5py.File(FILE_NAME, mode='r') as f:
#     # List available datasets.
#     print(f.keys())
#     ScienceData=f['ScienceData'] #'/ScienceData/UVAerosolIndex' 400*36
#     UVAerosolIndex = np.array(ScienceData['UVAerosolIndex']).reshape(14400)
#
#     O3BelowCloud = np.array(ScienceData['O3BelowCloud']).reshape(14400)
#     GeolocationData   =f['GeolocationData']
#     Latitude, Longitude=np.array(GeolocationData['Latitude']).reshape(14400),  np.array(GeolocationData['Longitude']).reshape(14400)
#
# df = pd.DataFrame({'Latitude': Latitude, 'Longitude': Longitude , 'O3BelowCloud': O3BelowCloud , 'UVAerosolIndex': UVAerosolIndex})
# df.to_pickle('UVAerosolIndex')
# print('hi')
#     # Read dataset.
#     # dset = f[DATAFIELD_NAME]
#     # data = dset[:]
#     #
#     # # Handle fill value.
#     # data[data == dset.fillvalue] = np.nan
#     # data = np.ma.masked_where(np.isnan(data), data)
#     #
#     # # Get attributes needed for the plot.
#     # # String attributes actually come in as the bytes type and should
#     # # be decoded to UTF-8 (python3).
#     # title = dset.attrs['Title'].decode()
#     # units = dset.attrs['Units'].decode()