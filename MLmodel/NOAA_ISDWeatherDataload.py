import eeweather
import datetime
import pytz

latitude = 33.8688
longitude=151.2093
# for documentation read https://eeweather.readthedocs.io/en/latest/api.html#summaries
ranked_stations = eeweather.rank_stations(latitude, longitude,is_tmy3=True)
station, warnings = eeweather.select_station(ranked_stations)
print(ranked_stations.loc[station.usaf_id])
start_date = datetime.datetime(2016, 6, 1, tzinfo=pytz.UTC)
end_date = datetime.datetime(2016, 6, 15, tzinfo=pytz.UTC)
tempC = station.load_isd_hourly_temp_data(start_date, end_date) #Integrated Surface Database (ISD)
tempC = station.load_isd_hourly_pcp24_data(start_date, end_date) #Integrated Surface Database (ISD)

# tempC = station.load_gsod_daily_temp_data(start_date, end_date) #GSOD : Global Surface Summary Of Day
# eeweather.plot_station_mapping(latitude, longitude, station, distance_meters=ranked_stations.loc[station.usaf_id][1])#, target='91104')