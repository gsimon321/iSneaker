
import pandas as pd
from faker import Faker
from collections import defaultdict
import sqlalchemy as db


engine = db.create_engine('mysql://root:SE3309root#@localhost/iSneaker', echo=False)
connection = engine.connect()
metadata = db.MetaData()


fake = Faker()

fake_data = defaultdict(list)

store = db.Table("Store", metadata,autoload=True, autoload_with=engine)
query = db.select([store.columns.street,  store.columns.state, store.columns.city])
StoreForeignProxy = connection.execute(query)
StoreForeignKeySet = StoreForeignProxy.fetchall()

for x in StoreForeignKeySet:

    for _ in range(6):
        fake_data["firstName"].append( fake.first_name() )
        fake_data["lastName"].append(fake.last_name())
        fake_data["email"].append(fake.free_email())
        fake_data["employeePassword"].append( fake.password(length=10))
        fake_data["salary"].append( fake.random_int(5000, 20000) )
        fake_data["storeStreet"].append( x[0] )
        fake_data["storeState"].append( x[1] )
        fake_data["storeCity"].append( x[2] )
    

df_fake_data = pd.DataFrame(fake_data)
df_fake_data.to_sql('Employee', con=engine, index=False, if_exists='append')




