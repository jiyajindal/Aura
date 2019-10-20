import csv
import pandas as pd
import random
import numpy as np




df = pd.read_csv('./data/1_Spatial_dataset_new.csv')
# df['daily max']= df['daily max']*11.36*0.75*random.uniform(0,1)
for i in df.index:
    print(df['daily max'][i])
    df['daily max'][i] = df['daily max'][i]  * random.uniform(0, 1)
    print(df['daily max'][i])
    df['ciggy'][i]= (df['daily max'][i]*11.36)/75
df.to_csv('./data/forcast_Spatial_dataset_new.csv')

#AirQualitySystem
df = pd.read_csv('./data/AirQualitySystem.csv')
# df = df[df['Date GMT'].str.contains('2018')]
df = df[df['Date GMT'].str.contains('2018-01-01')]
df = df[df['Date GMT']=='2018-01-01']
pollutants=df.pivot_table(index=['Latitude','Longitude','Date Local','Time Local'],columns='Parameter Name', values='Sample Measurement')
pollutants.to_csv('./data/Aura_AirQualitySystem.csv')

#MERRA2

# df = pd.read_csv('./data/MERRA2/20180101.state.slv.aer.csv')

print('hi')