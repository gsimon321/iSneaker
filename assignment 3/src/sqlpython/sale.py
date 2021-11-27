
import pandas as pd
from faker import Faker
from collections import defaultdict
import sqlalchemy as db
import random
import math
import numpy as np


engine = db.create_engine('mysql://root:SE3309root#@localhost/iSneaker', echo=False)
connection = engine.connect()
metadata = db.MetaData()


fake = Faker()

fake_data = defaultdict(list)

customer = db.Table("Customer", metadata,autoload=True, autoload_with=engine)
employee = db.Table("Employee", metadata,autoload=True, autoload_with=engine)
item     = db.Table("Item", metadata,autoload=True, autoload_with=engine)

queryCustomer = db.select([customer.columns.email])
queryEmployee =  db.select([employee.columns.email])
queryItem = db.select([item.columns.itemID])

CustomerForeignProxy = connection.execute(queryCustomer)
CustomerForeignKeySet = CustomerForeignProxy.fetchall()

EmployeeForeignProxy = connection.execute(queryEmployee)
EmployeeForeignKeySet = EmployeeForeignProxy.fetchall()

ItemForeignProxy = connection.execute(queryItem)
ItemForeignKeySet = ItemForeignProxy.fetchall()

# print(ItemForeignKeySet)
# print(CustomerForeignKeySet)

count=0

for employee in EmployeeForeignKeySet:
    for x in  range (10):
        count+=1
        randomRowC = np.random.randint(len(CustomerForeignKeySet), size=1)
        randomRowI = np.random.randint(len(ItemForeignKeySet), size=1)
        
        fake_data["totalSaleAmount"].append(round(random.uniform(100.00,10000.00),2))
        fake_data["saleType"].append( fake.word(ext_word_list=['order', 'instore']))
        fake_data["saleID"].append(fake.ean(length=8))
        fake_data["employeeEmail"].append(employee[0])
        fake_data["customerEmail"].append(CustomerForeignKeySet[randomRowC[0]][0])
        fake_data["itemID"].append(ItemForeignKeySet[randomRowI[0]][0])


print(count)

   
df_fake_data = pd.DataFrame(fake_data)

df_fake_data.to_sql('Sales', con=engine, index=False, if_exists='append')