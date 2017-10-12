from backend.extensions import db


class Column(db.Column):
    # overridden to make nullable False by default
    def __init__(self, *args, nullable=False, **kwargs):
        super(Column, self).__init__(*args, nullable=nullable, **kwargs)
