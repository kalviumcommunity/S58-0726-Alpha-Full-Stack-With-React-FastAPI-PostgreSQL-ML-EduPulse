from app.database.base import Base, engine
from app.models.student import Student

def init_db():
    Base.metadata.create_all(bind=engine)