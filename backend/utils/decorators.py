def was_decorated_without_parenthesis(args):
    return args and callable(args[0])
