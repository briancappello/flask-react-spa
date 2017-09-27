from marshmallow import pre_load, post_dump

from .model_serializer import ModelSerializer


class WrappedSerializer(ModelSerializer):
    """
    A version of ModelSchema that automatically wraps serialized results with
    the model name, and automatically unwraps during deserialization.

    NOTE: this might not behave as you'd expect if your serializer uses
    nested fields (if a nested object's serializer is also a WrappedSchema,
    then even the nested objects will end up wrapped, which probably isn't
    what you want...)

    Example usage:

    class Foo(db.Model):
        id = PrimaryKey
        name = String

    class FooSerializer(WrappedSerializer):
        class Meta:
            model = Foo
    foo_serializer = FooSerializer()

    foo = Foo(id=1, name='Foo')
    foo_json = foo_serializer.dump(foo).data # returns:
    foo_json == {
       "foo": {  // <-- added by self.wrap_with_envelope on @post_dump
          "id": 1,
          "name": "Foo"
       }
    }

    # and on deserialization, self.unwrap_envelope loads it correctly:
    foo = foo_serializer.load(foo_json).data
    isinstance(foo, Foo) == True
    """

    # define this on your serializers to set the envelope name(s),
    # instead of relying on automatic naming based on the model name
    __envelop__ = {
        'single': None,
        'many': None,
    }

    def get_envelope_key(self, many):
        single_key = self.__envelop__.get('single', None)
        many_key = self.__envelop__.get('many', None)
        if not many and single_key:
            return single_key
        elif many and many_key:
            return many_key

        key = self.Meta.model.__name__
        # JS tends to use camelCase, so that's what we use here by default
        key = key[0].lower() + key[1:]
        return key + 's' if many else key

    @pre_load(pass_many=True)
    def unwrap_envelope(self, data, many):
        return data[self.get_envelope_key(many)]

    @post_dump(pass_many=True)
    def wrap_with_envelope(self, data, many):
        return {self.get_envelope_key(many): data}
