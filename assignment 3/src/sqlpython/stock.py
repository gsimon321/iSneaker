
import pandas as pd
from faker import Faker
from collections import defaultdict
import sqlalchemy as db
from sqlalchemy.sql.expression import null


engine = db.create_engine('mysql://root:SE3309root#@localhost/iSneaker', echo=False)
connection = engine.connect()
metadata = db.MetaData()


fake = Faker()

fake_data = defaultdict(list)

item     = db.Table("Item", metadata,autoload=True, autoload_with=engine)
queryItem = db.select([item.columns.itemID])

ItemForeignProxy = connection.execute(queryItem)
ItemForeignKeySet = ItemForeignProxy.fetchall()


store = db.Table("Store", metadata,autoload=True, autoload_with=engine)
query = db.select([store.columns.street, store.columns.state, store.columns.city])

StoreForeignProxy = connection.execute(query)
StoreForeignKeySet = StoreForeignProxy.fetchall()



print(len(StoreForeignKeySet))




for location in StoreForeignKeySet:
    for stockItem in ItemForeignKeySet:
        fake_data["stockCount"].append(fake.random_int(0, 10000) )
        fake_data["storeStreet"].append(location[0])
        fake_data["storeState"].append(location[1])
        fake_data["storeCity"].append(location[2])
        fake_data["itemID"].append(stockItem[0])
        

    
    
df_fake_data = pd.DataFrame(fake_data)

df_fake_data.to_sql('Stock', con=engine, index=False, if_exists='append')