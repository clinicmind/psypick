"""python3 -m unittest discover -s tests   （僅用合成資料）"""
import os, sys, unittest
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "tools"))
import check_data as cd


def levels(rows):
    return [lv for lv, _ in rows]


class Rules(unittest.TestCase):
    def test_scoping_review_as_rct_is_error(self):
        self.assertEqual(levels(cd.check_case({"title_zh": "某範圍回顧", "study_design": ["rct"]})), ["ERROR"])

    def test_scoping_review_still_shown_as_e3_is_error(self):
        self.assertEqual(levels(cd.check_case({"evidence_note": "範圍回顧", "evidence_level": 3})), ["ERROR"])
        self.assertEqual(cd.check_case({"evidence_note": "範圍回顧", "evidence_level": 3, "study_design": ["scoping_review"]}), [])

    def test_protocol_with_efficacy_claim_warns_only(self):
        self.assertEqual(levels(cd.check_case({"study_design": ["protocol"], "summary_zh": "已證明有效"})), ["WARN"])

    def test_unknown_design_value_is_error(self):
        self.assertEqual(levels(cd.check_case({"study_design": ["magic"]})), ["ERROR"])

    def test_missing_fields_do_not_crash(self):
        self.assertEqual(cd.check_case({}), [])

    def test_takedown_date_used_as_deadline_is_error(self):
        it = {"bounty": {"deadline": "2027-01-01"}, "verify_reason": "下架日為 2027-01-01，以此作截止日"}
        self.assertEqual(levels(cd.check_bounty(it)), ["ERROR"])
        it = {"bounty": {"deadline": ""}, "verify_reason": "下架日不作截止日，截止日留空"}
        self.assertEqual(cd.check_bounty(it), [])

    def test_figures_roles_and_links(self):
        f = {"updates": [{"source_role": "不明", "url": "javascript:x"}, {"url": "https://example.org"}],
             "people": [{"slug": "p", "accounts": [{"url": "#"}]}]}
        self.assertEqual(sorted(levels(cd.check_figures(f))), ["ERROR", "ERROR", "ERROR", "WARN"])

    def test_current_site_data_has_no_errors(self):
        self.assertEqual([m for lv, m in cd.run() if lv == "ERROR"], [])


if __name__ == "__main__":
    unittest.main()
