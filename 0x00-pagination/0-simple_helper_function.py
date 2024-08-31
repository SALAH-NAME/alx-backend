#!/usr/bin/env python3
""" 0-simple_helper_function.py """
from typing import Tuple


def index_range(page: int, page_size: int) -> Tuple[int, int]:
    """
    index_range function
    """
    s_index = (page - 1) * page_size
    e_index = s_index + page_size
    return (s_index, e_index)
