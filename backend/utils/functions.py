# # utils/functions.py
# # Utility helpers and the dynamic explanation generator (offline, label-free).

# from functools import wraps
# from collections.abc import Iterable, Sequence

# def memoize(f):
#     cache = {}
#     @wraps(f)
#     def wrapper(*args):
#         if args in cache:
#             return cache[args]
#         rv = f(*args)
#         cache[args] = rv
#         return rv
#     return wrapper

# def get(d, key, default=None):
#     return d.get(key, default) if d else default

# def assoc(d, key, val, *kvs):
#     new = dict(d or {})
#     new[key] = val
#     for i in range(0, len(kvs), 2):
#         new[kvs[i]] = kvs[i + 1]
#     return new

# def merge(*dicts):
#     result = {}
#     for d in dicts:
#         if d:
#             result.update(d)
#     return result

# def identity(x):
#     return x

# def walk(inner, outer, data):
#     def process_node(k, v):
#         if not isinstance(v, Iterable) or isinstance(v, str):
#             return inner(k, v)
#         if isinstance(v, Sequence) and not isinstance(v, str):
#             rows = [walk(inner, identity, row) for row in v]
#             rv = [row for row in rows if row]
#         else:
#             rv = walk(inner, identity, v)
#         return (k, rv) if rv else None

#     if isinstance(data, Sequence) and not isinstance(data, str):
#         return outer([walk(inner, identity, x) for x in data])

#     nodes = [process_node(k, v) for k, v in data.items()]
#     return outer({k: v for k, v in nodes if k is not None})


# # -------------------------
# # Dynamic half-explanation
# # -------------------------
# # This produces a short (half) explanation using pattern heuristics on the predicted name.
# # It's offline, dynamic and requires no labeled mapping beyond what your model outputs.

# def _clean_name(name: str) -> str:
#     if not name:
#         return ""
#     return name.strip().lower()

# def _match_any(name: str, keywords):
#     return any(k in name for k in keywords)

# def generate_half_explanation(predicted_name: str) -> str:
#     """
#     Return a short two-sentence explanation (half explanation) based on heuristics.
#     This is intentionally lightweight and label-free.
#     """
#     name = _clean_name(predicted_name)

#     # Patterns and corresponding short explanations (2-sentence style)
#     if _match_any(name, ["fung", "ringworm", "tinea", "yeast", "candida"]):
#         return ("This appears fungal and commonly causes redness, itching or scaling. "
#                 "Keeping the area dry and using antifungal topical care is typically advised.")

#     if _match_any(name, ["dermat", "derm", "eczema", "atopic", "contact"]):
#         return ("This seems dermatological with inflammation and itching as common signs. "
#                 "Moisturizers and avoiding triggers often help to manage symptoms.")

#     if _match_any(name, ["psor", "psoriasis"]):
#         return ("This condition often produces thick, scaly patches and can be itchy or sore. "
#                 "Topical therapy and consulting a clinician for management are common steps.")

#     if _match_any(name, ["acne", "pimple", "comedone"]):
#         return ("This looks like an acne-type issue driven by blocked follicles and inflammation. "
#                 "Topical cleansers and targeted treatment reduce lesions and irritation.")

#     if _match_any(name, ["virus", "herpes", "molluscum", "wart", "hpv"]):
#         return ("This suggests a viral-related skin issue often with small lesions or blisters. "
#                 "It may resolve with time or need targeted antiviral/clinic procedures.")

#     if _match_any(name, ["bacter", "impetigo", "cellulitis", "staph", "strep"]):
#         return ("This seems bacterial and can show redness, warmth, or pus-like discharge. "
#                 "Topical or systemic antibiotics under medical guidance are commonly used.")

#     if _match_any(name, ["melan", "carcinoma", "cancer", "nevus", "tumor"]):
#         return ("This could involve abnormal cell growth and may need prompt clinical evaluation. "
#                 "Early professional assessment and possible biopsy are important for diagnosis.")

#     if _match_any(name, ["ulcer", "erosion", "wound", "crust"]):
#         return ("This describes an open or eroded lesion that can cause pain or drainage. "
#                 "Cleaning, protection and clinician review are recommended to prevent infection.")

#     # Generic fallback (still short)
#     if name:
#         return ("This skin condition likely involves irritation or inflammation with localized symptoms. "
#                 "Keeping the area clean, avoiding harsh products and seeking clinical advice if it worsens is sensible.")
#     else:
#         return ("No disease name provided; cannot infer specifics. "
#                 "Provide the predicted name and the system will generate a short explanation.")
