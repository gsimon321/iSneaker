
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
count=0



for _ in range(200):
    count+=1
    fake_data["itemID"].append(count)
    


df_fake_data = pd.DataFrame(fake_data)
df_fake_data.to_sql('Item', con=engine, index=False, if_exists='append')

# shoes = db.Table("Item", metadata,autoload=True, autoload_with=engine)
# query = db.select([shoes])
# StoreForeignProxy = connection.execute(query)
# StoreForeignKeySet = StoreForeignProxy.fetchall()

