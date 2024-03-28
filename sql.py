from google.cloud.sql.connector import Connector
import pymysql
import sqlalchemy

# initialize Connector object
connector = Connector()

# function to return the database connection
def getconn() -> pymysql.connections.Connection:
    conn: pymysql.connections.Connection = connector.connect(
        "cloudproject01-418023:us-central1:admin01",
        "pymysql",
        user="admin01",
        password="sufsidra97",
        db="shopping_list"
    )
    return conn

# create connection pool
pool = sqlalchemy.create_engine(
    "mysql+pymysql://",
    creator=getconn,
)

#Sample
# insert statement
insert_stmt = sqlalchemy.text(
    "INSERT INTO my_table (id, title) VALUES (:id, :title)",
)

with pool.connect() as db_conn:
    # insert into database
    db_conn.execute(insert_stmt, parameters={"id": "book1", "title": "Book One"})

    # query database
    result = db_conn.execute(sqlalchemy.text("SELECT * from my_table")).fetchall()

    # commit transaction (SQLAlchemy v2.X.X is commit as you go)
    db_conn.commit()

    # Do something with the results
    for row in result:
        print(row)

connector.close()