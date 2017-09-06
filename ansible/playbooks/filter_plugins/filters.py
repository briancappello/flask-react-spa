import six


def is_omitted(value):
    return isinstance(value, six.string_types) and value.startswith('__omit_place_holder__')


def filter_omitted(dict_):
    return {k: v for k, v in dict_.items() if not is_omitted(v)}


class FilterModule(object):
    def filters(self):
        return {
            'filter_omitted': filter_omitted,
        }
