from re import S
import pandas as pd
from faker import Faker
from collections import defaultdict
import sqlalchemy as db
import random
import math


engine = db.create_engine('mysql://root:SE3309root#@localhost/iSneaker', echo=False)
connection = engine.connect()
metadata = db.MetaData()


fake = Faker()

fake_data = defaultdict(list)
count=101

item     = db.Table("Item", metadata,autoload=True, autoload_with=engine)
queryItem = db.select([item.columns.itemID])

ItemForeignProxy = connection.execute(queryItem)
ItemForeignKeySet = ItemForeignProxy.fetchall()

count=100



for _ in range(100):
    fake_data["brand"].append( fake.word(ext_word_list=['Nike', 'Adidas', 'UnderArmour', 'NewBalance', 'Saucony', 'Avia', 'Nfiniy', 'AirJordan', 'Reebok', 'Puma']))
    fake_data["price"].append(round(random.uniform(3.00,100.00),2))
    fake_data["color"].append( fake.color_name() )
    fake_data["size"].append(fake.word(ext_word_list=['XSM', 'SM', 'M', 'L', 'XL', 'XXL', 'XXXL']))
    fake_data["cut"].append(fake.word(ext_word_list=['low', 'medium', 'high', 'heel', 'athletic', 'comfortable', 'tight', 'loose']) )
    fake_data["material"].append(fake.word(ext_word_list=['running', 'hiking', 'basketball', 'football', 'volleyball', 'walking', 'squash', 'tennis']) )
    fake_data["sockID"].append(ItemForeignKeySet[count][0])
    count+=1



df_fake_data = pd.DataFrame(fake_data)
df_fake_data.to_sql('Socks', con=engine, index=False, if_exists='append')

socks = db.Table("Socks", metadata,autoload=True, autoload_with=engine)
query = db.select([socks])
StoreForeignProxy = connection.execute(query)
StoreForeignKeySet = StoreForeignProxy.fetchall()

