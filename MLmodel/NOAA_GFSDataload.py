import pandas as pd
import matplotlib.pyplot as plt
import datetime
from pvlib.forecast import GFS, NAM, NDFD, HRRR, RAP #Global Forecast System (GFS), North American Model (NAM), High Resolution Rapid Refresh (HRRR), Rapid Refresh (RAP), and National Digital Forecast Database (NDFD)

def load_GFS_data(latitude = 33.8688,longitude=151.2093, tz='Australia/Sydney', days=7):

    # latitude, longitude, tz = 32.2, -110.9, 'US/Arizona'
    # latitude, longitude, tz = 32.2, -110.9, 'US/Arizona'
    # latitude = 33.8688
    # longitude=151.2093
    # tz='Australia/Sydney'
    start = pd.Timestamp(datetime.date.today(), tz=tz)
    end = start + pd.Timedelta(days=7)
    irrad_vars = ['ghi', 'dni', 'dhi']

    model = GFS()
    raw_data = model.get_data(latitude, longitude, start, end)
    print(raw_data.head())

    data = raw_data
    data = model.rename(data)
    data['temp_air'] = model.kelvin_to_celsius(data['temp_air'])
    data['wind_speed'] = model.uv_to_speed(data)
    irrad_data = model.cloud_cover_to_irradiance(data['total_clouds'])
    data = data.join(irrad_data, how='outer')
    data = data[model.output_variables]
    print(data.head())

    data = model.process_data(raw_data)
    print(data.head())

    data = model.get_processed_data(latitude, longitude, start, end)

    print(data.head())

    return(data)