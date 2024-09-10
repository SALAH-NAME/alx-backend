#!/usr/bin/env python3
""" 7-app.py """
from flask import Flask, render_template, request, g
from flask_babel import Babel, _
import pytz
from pytz.exceptions import UnknownTimeZoneError


app = Flask(__name__)


users = {
    1: {"name": "Balou", "locale": "fr", "timezone": "Europe/Paris"},
    2: {"name": "Beyonce", "locale": "en", "timezone": "US/Central"},
    3: {"name": "Spock", "locale": "kg", "timezone": "Vulcan"},
    4: {"name": "Teletubby", "locale": None, "timezone": "Europe/London"},
}


class Config:
    """Config function
    """
    LANGUAGES = ["en", "fr"]
    BABEL_DEFAULT_LOCALE = "en"
    BABEL_DEFAULT_TIMEZONE = "UTC"


app.config.from_object(Config)

babel = Babel(app)


def get_user():
    """get_user function
    """
    user_id = request.args.get('login_as')
    if user_id:
        return users.get(int(user_id))
    return None


@babel.localeselector
def get_locale():
    """get_locale function
    """
    locale = request.args.get('locale')
    if locale in app.config['LANGUAGES']:
        return locale
    user = g.get('user')
    if user and user['locale'] in app.config['LANGUAGES']:
        return user['locale']
    return request.accept_languages.best_match(app.config['LANGUAGES'])


@babel.timezoneselector
def get_timezone():
    """get_timezone function
    """
    timezone = request.args.get('timezone')
    if timezone:
        try:
            return pytz.timezone(timezone).zone
        except UnknownTimeZoneError:
            pass
    user = g.get('user')
    if user:
        user_timezone = user.get('timezone')
        if user_timezone:
            try:
                return pytz.timezone(user_timezone).zone
            except UnknownTimeZoneError:
                pass
    return 'UTC'


@app.before_request
def before_request():
    """before_request function
    """
    g.user = get_user()


@app.route('/')
def index():
    """index function
    """
    return render_template('7-index.html')


if __name__ == '__main__':
    app.run(debug=True)
