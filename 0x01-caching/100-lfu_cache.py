#!/usr/bin/env python3
""" 100-lfu_cache.py """

from base_caching import BaseCaching
from collections import OrderedDict
import operator


class LFUCache(BaseCaching):
    """LFUCache Class
    """
    def __init__(self):
        """ __init__
        """
        super().__init__()
        self.frequency = OrderedDict()
        self.sorted_items = None

    def put(self, key, item):
        """ put function
        """
        if (len(self.cache_data) == self.MAX_ITEMS and
                key not in self.frequency):
            self.sorted_items = sorted(
                self.frequency.items(), key=operator.itemgetter(1)
            )
            discard = self.sorted_items.pop(0)[0]
            del self.frequency[discard]
            del self.cache_data[discard]
            print("DISCARD: {}".format(discard))

        if key and item:
            value = 0
            if key in self.cache_data:
                value = self.frequency[key]
                del self.frequency[key]

            self.frequency[key] = value + 1
            self.cache_data[key] = item

    def get(self, key):
        """ get function
        """
        if not key or key not in self.cache_data:
            return None

        value = 0
        if key in self.frequency.keys():
            value = self.frequency[key]
            del self.frequency[key]

        self.frequency[key] = value + 1
        return self.cache_data[key]
