import pandas as pd
from faker import Faker
from collections import defaultdict
import sqlalchemy as db


engine = db.create_engine('mysql://root:SE3309root#@localhost/iSneaker', echo=False)
connection = engine.connect()
metadata = db.MetaData()


fake = Faker()

fake_data = defaultdict(list)


for _ in range(30):
    fake_data["street"].append( fake.street_address() )
    fake_data["postalCode"].append( int(fake.postalcode()) )
    fake_data["city"].append( fake.city() )
    fake_data["state"].append( fake.state() )
    fake_data["longitude"].append(float (fake.longitude()))
    fake_data["latitude"].append(float (fake.latitude()))

df_fake_data = pd.DataFrame(fake_data)

df_fake_data.to_sql('Store', con=engine, index=False, if_exists='append')


store = db.Table("Store", metadata,autoload=True, autoload_with=engine)

query = db.select([store.columns.street, store.columns.city, store.columns.state])

StoreForeignProxy = connection.execute(query)
StoreForeignKeySet = StoreForeignProxy.fetchall()





