#!/usr/bin/env python3
""" 2-app.py """
from flask import Flask, render_template, request
from flask_babel import Babel


app = Flask(__name__)


class Config:
    """Config Class
    """
    LANGUAGES = ["en", "fr"]
    BABEL_DEFAULT_LOCALE = "en"
    BABEL_DEFAULT_TIMEZONE = "UTC"


app.config.from_object(Config)

babel = Babel(app)


@babel.localeselector
def get_locale():
    """get_locale function
    """
    return request.accept_languages.best_match(app.config['LANGUAGES'])


@app.route('/')
def index():
    """index function
    """
    return render_template('2-index.html')


if __name__ == '__main__':
    app.run(debug=True)
