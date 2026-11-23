#!/usr/bin/env python3
"""Build bundled offline Gita JSON from gita/gita raw exports."""

from __future__ import annotations

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / "data"

CHAPTER_NAMES = {
    1: ("Arjuna Vishada Yoga", "अर्जुनविषादयोग", "The Yoga of Arjuna's Dejection"),
    2: ("Sankhya Yoga", "सांख्ययोग", "The Yoga of Knowledge"),
    3: ("Karma Yoga", "कर्मयोग", "The Yoga of Action"),
    4: ("Jnana Karma Sanyasa Yoga", "ज्ञानकर्मसंन्यासयोग", "The Yoga of Knowledge and Renunciation of Action"),
    5: ("Karma Sanyasa Yoga", "कर्मसंन्यासयोग", "The Yoga of Renunciation"),
    6: ("Dhyana Yoga", "ध्यानयोग", "The Yoga of Meditation"),
    7: ("Jnana Vijnana Yoga", "ज्ञानविज्ञानयोग", "The Yoga of Knowledge and Realization"),
    8: ("Akshara Brahma Yoga", "अक्षरब्रह्मयोग", "The Yoga of the Imperishable Brahman"),
    9: ("Raja Vidya Raja Guhya Yoga", "राजविद्याराजगुह्ययोग", "The Yoga of Royal Knowledge and Royal Secret"),
    10: ("Vibhuti Yoga", "विभूतियोग", "The Yoga of Divine Glories"),
    11: ("Vishwarupa Darshana Yoga", "विश्वरूपदर्शनयोग", "The Yoga of the Vision of the Universal Form"),
    12: ("Bhakti Yoga", "भक्तियोग", "The Yoga of Devotion"),
    13: ("Kshetra Kshetragna Vibhaga Yoga", "क्षेत्रक्षेत्रज्ञविभागयोग", "The Yoga of the Field and the Knower"),
    14: ("Gunatraya Vibhaga Yoga", "गुणत्रयविभागयोग", "The Yoga of the Three Gunas"),
    15: ("Purushottama Yoga", "पुरुषोत्तमयोग", "The Yoga of the Supreme Person"),
    16: ("Daivasura Sampad Vibhaga Yoga", "दैवासुरसम्पद्विभागयोग", "The Yoga of Divine and Demonic Qualities"),
    17: ("Shraddhatraya Vibhaga Yoga", "श्रद्धात्रयविभागयोग", "The Yoga of the Threefold Faith"),
    18: ("Moksha Sanyasa Yoga", "मोक्षसंन्यासयोग", "The Yoga of Liberation and Renunciation"),
}

# Curated thematic cross-references (chapter, verse)
RELATED = {
    "duty": [(2, 47), (3, 19), (3, 35), (18, 47)],
    "devotion": [(9, 22), (9, 26), (12, 2), (18, 65)],
    "knowledge": [(2, 16), (4, 38), (7, 17), (13, 2)],
    "equanimity": [(2, 14), (2, 48), (2, 56), (6, 5)],
    "self": [(2, 20), (2, 22), (6, 29), (15, 7)],
    "renunciation": [(5, 3), (6, 1), (18, 2), (18, 49)],
}


def theme_for_cv(chapter: int, verse: int) -> str:
    mapping = {
        1: "duty",
        2: "equanimity",
        3: "duty",
        4: "knowledge",
        5: "renunciation",
        6: "self",
        7: "knowledge",
        8: "self",
        9: "devotion",
        10: "devotion",
        11: "devotion",
        12: "devotion",
        13: "knowledge",
        14: "equanimity",
        15: "self",
        16: "duty",
        17: "devotion",
        18: "renunciation",
    }
    return mapping.get(chapter, "duty")


def clean(text: str | None) -> str:
    if not text:
        return ""
    return " ".join(text.replace("\n", " ").split()).strip()


def main() -> None:
    verses_raw = json.loads((DATA / "raw-verse.json").read_text(encoding="utf-8"))
    translations = json.loads((DATA / "raw-translation.json").read_text(encoding="utf-8"))
    chapters_raw = json.loads((DATA / "raw-chapters.json").read_text(encoding="utf-8"))

    en_purohit: dict[int, str] = {}
    en_sivananda: dict[int, str] = {}
    hi: dict[int, str] = {}

    for row in translations:
        vid = row["verse_id"]
        desc = clean(row.get("description"))
        if row["author_id"] == 21:
            en_purohit[vid] = desc
        elif row["author_id"] == 16:
            en_sivananda[vid] = desc
        elif row["author_id"] == 17:
            hi[vid] = desc

    chapters_meta = []
    for ch in chapters_raw:
        n = ch["chapter_number"]
        name_en, name_sa, meaning = CHAPTER_NAMES[n]
        chapters_meta.append(
            {
                "number": n,
                "name_english": name_en,
                "name_sanskrit": name_sa,
                "meaning": meaning,
                "verses_count": ch.get("verses_count") or ch.get("verse_count"),
                "summary": clean(ch.get("chapter_summary") or ch.get("chapter_summary_english")),
            }
        )

    verses = []
    for v in sorted(verses_raw, key=lambda x: (x["chapter_number"], x["verse_number"])):
        vid = v["id"]
        chapter = v["chapter_number"]
        verse_no = v["verse_number"]
        theme = theme_for_cv(chapter, verse_no)
        related = [
            {"chapter": c, "verse": vv}
            for c, vv in RELATED[theme]
            if not (c == chapter and vv == verse_no)
        ][:4]

        translation = en_purohit.get(vid) or en_sivananda.get(vid) or ""
        verses.append(
            {
                "id": f"{chapter}:{verse_no}",
                "index": len(verses),
                "chapter": chapter,
                "verse": verse_no,
                "sanskrit": clean(v.get("text")),
                "transliteration": clean(v.get("transliteration")),
                "word_meanings": clean(v.get("word_meanings")),
                "translation": translation,
                "translation_sivananda": en_sivananda.get(vid, ""),
                "translation_hindi": hi.get(vid, ""),
                "theme": theme,
                "related": related,
            }
        )

    # Fix verses_count if missing
    counts: dict[int, int] = {}
    for verse in verses:
        counts[verse["chapter"]] = counts.get(verse["chapter"], 0) + 1
    for ch in chapters_meta:
        ch["verses_count"] = counts.get(ch["number"], ch["verses_count"] or 0)

    payload = {
        "title": "Bhagavad Gita",
        "translation_primary": "Shri Purohit Swami (public domain)",
        "translation_fallback": "Swami Sivananda",
        "verse_count": len(verses),
        "chapters": chapters_meta,
        "verses": verses,
        "themes": RELATED,
    }

    out = DATA / "gita.json"
    out.write_text(json.dumps(payload, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")
    print(f"Wrote {out} with {len(verses)} verses, {len(chapters_meta)} chapters")


if __name__ == "__main__":
    main()
