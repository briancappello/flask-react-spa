import os
import sys

from flask.cli import cli


@cli.command()
def shell():
    """Runs a shell in the app context."""
    banner, ctx = _make_shell_ctx()
    try:
        import IPython
        IPython.embed(header=banner, user_ns=ctx)
    except ImportError:
        import code
        code.interact(banner=banner, local=ctx)


def _make_shell_ctx():
    from flask.globals import _app_ctx_stack
    app = _app_ctx_stack.top.app
    banner = 'Python %s on %s\nApp: %s%s\nInstance: %s' % (
        sys.version,
        sys.platform,
        app.import_name,
        app.debug and ' [debug]' or '',
        app.instance_path,
    )
    ctx = {}

    # Support the regular Python interpreter startup script if someone
    # is using it.
    startup = os.environ.get('PYTHONSTARTUP')
    if startup and os.path.isfile(startup):
        with open(startup, 'r') as f:
            eval(compile(f.read(), startup, 'exec'), ctx)

    ctx.update(app.make_shell_context())

    return banner, ctx
