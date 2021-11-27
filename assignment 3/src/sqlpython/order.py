
import pandas as pd
from faker import Faker
from collections import defaultdict
import sqlalchemy as db
from datetime import date


engine = db.create_engine('mysql://root:SE3309root#@localhost/iSneaker', echo=False)
connection = engine.connect()
metadata = db.MetaData()


fake = Faker()

fake_data = defaultdict(list)

sales = db.Table("Sales", metadata,autoload=True, autoload_with=engine)
saleQuery = db.select([sales.columns.saleID, sales.columns.saleType, sales.columns.customerEmail])




SaleForeignProxy = connection.execute(saleQuery)
SaleForeignKeySet = SaleForeignProxy.fetchall()



for sold in SaleForeignKeySet:
    if(sold[1]=="order"):
            fake_data["courierServer"].append(fake.word(ext_word_list=['FedEx', 'UPS', 'APL', 'DHL', 'Canada Post', 'Agility Logistics', 'Hyundai Glovis', 'DB Schenker', 'Kuehne + Nagel']) )
            fake_data["dateShipped"].append(str(fake.date_between(date(2021, 12, 12), date(2022, 12, 30) )))
            fake_data["saleID"].append(sold[0])
            fake_data["customerEmail"].append(sold[2])
      

    
    
    
df_fake_data = pd.DataFrame(fake_data)

df_fake_data.to_sql('Orders', con=engine, index=False, if_exists='append')