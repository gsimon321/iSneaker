
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



item     = db.Table("Item", metadata,autoload=True, autoload_with=engine)
queryItem = db.select([item.columns.itemID])

ItemForeignProxy = connection.execute(queryItem)
ItemForeignKeySet = ItemForeignProxy.fetchall()

count=0

for _ in range(100):
    fake_data["brand"].append( fake.word(ext_word_list=['Nike', 'Adidas', 'Under Armour', 'New Balance', 'Saucony', 'Avia', 'Nfiniy', 'Air Jordan', 'Reebok', 'Puma']))
    fake_data["price"].append(round(random.uniform(50.00,2000.00),2))
    fake_data["size"].append(fake.random_int(3, 22))
    fake_data["shoeType"].append(fake.word(ext_word_list=['running', 'hiking', 'basketball', 'football', 'volleyball', 'walking', 'squash', 'tennis']) )
    fake_data["color"].append( fake.color_name() )
    fake_data["shoeID"].append(ItemForeignKeySet[count][0])
    count+=1


df_fake_data = pd.DataFrame(fake_data)
df_fake_data.to_sql('Shoes', con=engine, index=False, if_exists='append')

shoes = db.Table("Shoes", metadata,autoload=True, autoload_with=engine)
query = db.select([shoes])
StoreForeignProxy = connection.execute(query)
StoreForeignKeySet = StoreForeignProxy.fetchall()

