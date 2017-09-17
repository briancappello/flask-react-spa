from ..database import (
    Model,
    Column,
    String,
    Text,
)


class ContactSubmission(Model):
    name = Column(String(50), nullable=False)
    email = Column(String(50), nullable=False)
    message = Column(Text, nullable=False)
