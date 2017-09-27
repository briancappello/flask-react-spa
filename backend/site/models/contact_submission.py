from backend.database import (
    Model,
    Column,
    String,
    Text,
)


class ContactSubmission(Model):
    name = Column(String(50))
    email = Column(String(50))
    message = Column(Text)
