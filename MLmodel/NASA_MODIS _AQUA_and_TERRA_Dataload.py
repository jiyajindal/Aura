mport
numpy as np
import h5py
import pandas as pd

FILE_NAME = '/home/maryam/Downloads/OMPS-NPP_NMTO3-L2-NRT_v2.1_2019m1011t235700_o41224_2019m1012t012024.h5'
with h5py.File(FILE_NAME, mode='r') as f:
    # List available datasets.
    print(f.keys())
