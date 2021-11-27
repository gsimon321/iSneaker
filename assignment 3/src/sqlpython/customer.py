import pandas as pd
from faker import Faker
from collections import defaultdict
import sqlalchemy as db
from datetime import date


engine = db.create_engine('mysql://root:SE3309root#@localhost/iSneaker', echo=False)
connection = engine.connect()
metadata = db.MetaData()


fake = Faker()



fake_customer = defaultdict(list)

for _ in range(150):
    fake_customer["firstName"].append(fake.first_name())
    fake_customer["lastName"].append(fake.last_name())
    fake_customer["homePhone"].append(int(fake.msisdn()))
    fake_customer["email"].append(fake.free_email())
    fake_customer["street"].append( fake.street_address() )
    fake_customer["postalCode"].append( int(fake.postalcode()) )
    fake_customer["city"].append( fake.city() )
    fake_customer["state"].append( fake.state() )
    fake_customer["cardNumber"].append(fake.random_int(10000000, 99999999))
    fake_customer["CVC"].append(int(fake.random_int(100, 999)))
    fake_customer["cardType"].append(fake.credit_card_provider())
    fake_customer["expiryDate"].append(str(fake.date_between(date(2022, 12, 12), date(2050, 12, 30) )))
    fake_customer["longitude"].append(float (fake.longitude()))
    fake_customer["latitude"].append(float (fake.latitude()))

df_fake_customer = pd.DataFrame(fake_customer)

df_fake_customer.to_sql('Customer', con=engine, index=False, if_exists='append')

   






customer = db.Table("Customer", metadata,autoload=True, autoload_with=engine)

query = db.select([customer])

StoreForeignProxy = connection.execute(query)
StoreForeignKeySet = StoreForeignProxy.fetchall()



print(StoreForeignKeySet)

for x in StoreForeignKeySet:
    print(x)
    

