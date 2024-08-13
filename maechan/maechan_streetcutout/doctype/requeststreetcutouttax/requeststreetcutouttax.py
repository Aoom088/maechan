# Copyright (c) 2024, SE and contributors
# For license information, please see license.txt

# import frappe
from frappe.model.document import Document


class RequestStreetcutoutTax(Document):
	# begin: auto-generated types
	# This code is auto-generated. Do not modify anything in this block.

	from typing import TYPE_CHECKING

	if TYPE_CHECKING:
		from frappe.types import DF
		from maechan.maechan_streetcutout.doctype.streetcutoutlocationtable.streetcutoutlocationtable import StreetcutoutLocationTable

		amended_from: DF.Link | None
		approve_status_requeststreetcutouttax: DF.Literal["\u0e2a\u0e23\u0e49\u0e32\u0e07", "\u0e23\u0e30\u0e2b\u0e27\u0e48\u0e32\u0e07\u0e01\u0e32\u0e23\u0e1e\u0e34\u0e08\u0e32\u0e23\u0e13\u0e32", "\u0e23\u0e2d\u0e0a\u0e33\u0e23\u0e30\u0e40\u0e07\u0e34\u0e19", "\u0e23\u0e30\u0e2b\u0e27\u0e48\u0e32\u0e07\u0e01\u0e32\u0e23\u0e15\u0e23\u0e27\u0e08\u0e2a\u0e2d\u0e1a", "\u0e23\u0e2d\u0e2d\u0e19\u0e38\u0e21\u0e31\u0e15\u0e34", "\u0e2d\u0e19\u0e38\u0e21\u0e31\u0e15\u0e34", "\u0e22\u0e01\u0e40\u0e25\u0e34\u0e01", "\u0e2b\u0e21\u0e14\u0e2d\u0e32\u0e22\u0e38"]
		cost_requeststreetcutouttax: DF.Data | None
		expiration_date_requeststreetcutouttax: DF.Date | None
		payment_requeststreetcutouttax: DF.AttachImage | None
		streetcutout_count_requeststreetcutouttax: DF.Data | None
		streetcutout_high_requeststreetcutouttax: DF.Data | None
		streetcutout_location_table_requeststreetcutouttax: DF.Table[StreetcutoutLocationTable]
		streetcutout_width_requeststreetcutouttax: DF.Data | None
		user_name_requeststreetcutouttax: DF.Data
	# end: auto-generated types

	pass
