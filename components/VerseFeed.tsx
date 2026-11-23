import { useCallback, useEffect, useRef, useState } from 'react';
import {
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
  type LayoutChangeEvent,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { VerseScreen } from '@/components/VerseScreen';
import { fonts } from '@/constants/theme';
import { chapterDisplayName, chapters, verses } from '@/lib/gita';
import { useI18n } from '@/lib/i18n';
import { useAppStore } from '@/lib/store';
import { useAppTheme } from '@/lib/useAppTheme';

export function VerseFeed() {
  const theme = useAppTheme();
  const { language, t } = useI18n();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const listRef = useRef<FlatList>(null);
  const readingIndex = useAppStore((s) => s.readingIndex);
  const setReadingIndex = useAppStore((s) => s.setReadingIndex);
  const bookmarks = useAppStore((s) => s.bookmarks);
  const likes = useAppStore((s) => s.likes);
  const toggleBookmark = useAppStore((s) => s.toggleBookmark);
  const toggleLike = useAppStore((s) => s.toggleLike);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [pageHeight, setPageHeight] = useState(0);

  const onLayout = (e: LayoutChangeEvent) => {
    setPageHeight(e.nativeEvent.layout.height);
  };

  useEffect(() => {
    if (pageHeight <= 0) return;
    requestAnimationFrame(() => {
      listRef.current?.scrollToIndex({
        index: Math.min(readingIndex, verses.length - 1),
        animated: false,
      });
    });
  }, [pageHeight]);

  const onViewableItemsChanged = useRef((info: { viewableItems: Array<{ index?: number | null }> }) => {
    const first = info.viewableItems[0];
    if (first?.index != null) setReadingIndex(first.index);
  }).current;

  const viewabilityConfig = useRef({ itemVisiblePercentThreshold: 80 }).current;

  const jumpToChapter = useCallback(
    (chapter: number) => {
      const index = verses.find((v) => v.chapter === chapter)?.index ?? 0;
      setPickerOpen(false);
      setReadingIndex(index);
      listRef.current?.scrollToIndex({ index, animated: false });
    },
    [setReadingIndex]
  );

  const current = verses[readingIndex];

  return (
    <View style={[styles.fill, { backgroundColor: theme.background }]} onLayout={onLayout}>
      {pageHeight > 0 ? (
        <FlatList
          ref={listRef}
          data={verses}
          keyExtractor={(item) => item.id}
          pagingEnabled
          snapToInterval={pageHeight}
          snapToAlignment="start"
          disableIntervalMomentum
          decelerationRate="fast"
          showsVerticalScrollIndicator={false}
          bounces={false}
          removeClippedSubviews={false}
          getItemLayout={(_, index) => ({
            length: pageHeight,
            offset: pageHeight * index,
            index,
          })}
          onViewableItemsChanged={onViewableItemsChanged as any}
          viewabilityConfig={viewabilityConfig}
          onScrollToIndexFailed={(info) => {
            setTimeout(() => {
              listRef.current?.scrollToIndex({ index: info.index, animated: false });
            }, 100);
          }}
          renderItem={({ item }) => (
            <View style={{ height: pageHeight, width: '100%' }}>
              <VerseScreen
                verse={item}
                bookmarked={bookmarks.includes(item.id)}
                liked={likes.includes(item.id)}
                onToggleBookmark={() => toggleBookmark(item.id)}
                onToggleLike={() => toggleLike(item.id)}
                onOpenStudy={() => {
                  router.push(`/study?id=${encodeURIComponent(item.id)}`);
                }}
                onOpenCard={() => {
                  router.push(`/card?id=${encodeURIComponent(item.id)}`);
                }}
              />
            </View>
          )}
        />
      ) : null}

      <Pressable
        onPress={() => setPickerOpen(true)}
        style={[
          styles.scrubber,
          {
            top: insets.top + 56,
            right: 16,
            backgroundColor: theme.backgroundElevated,
            borderColor: theme.border,
          },
        ]}>
        <Text style={[styles.scrubberText, { color: theme.text }]}>
          {current?.chapter ?? 1}.{current?.verse ?? 1}
        </Text>
      </Pressable>

      <Modal visible={pickerOpen} animationType="slide" transparent>
        <View style={[styles.modalOverlay, { backgroundColor: theme.overlay }]}>
          <View style={[styles.sheet, { backgroundColor: theme.backgroundElevated }]}>
            <Text style={[styles.sheetTitle, { color: theme.text }]}>{t.chapters}</Text>
            <FlatList
              data={chapters}
              keyExtractor={(c) => String(c.number)}
              renderItem={({ item }) => (
                <Pressable
                  onPress={() => jumpToChapter(item.number)}
                  style={[styles.chapterRow, { borderBottomColor: theme.border }]}>
                  <Text style={[styles.chapterNum, { color: theme.accent }]}>
                    {item.number}
                  </Text>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.chapterName, { color: theme.text }]}>
                      {chapterDisplayName(item, language)}
                    </Text>
                    <Text style={{ color: theme.textMuted, fontFamily: fonts.body, fontSize: 12 }}>
                      {t.versesCount(item.verses_count)} ·{' '}
                      {t.chapterMeanings[item.number] ?? item.meaning}
                    </Text>
                  </View>
                </Pressable>
              )}
            />
            <Pressable onPress={() => setPickerOpen(false)} style={styles.closeBtn}>
              <Text style={{ color: theme.accent, fontFamily: fonts.bodySemi }}>{t.close}</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  scrubber: {
    position: 'absolute',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    zIndex: 5,
  },
  scrubberText: {
    fontFamily: fonts.bodySemi,
    fontSize: 13,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  sheet: {
    maxHeight: '78%',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 28,
  },
  sheetTitle: {
    fontFamily: fonts.display,
    fontSize: 28,
    marginBottom: 12,
  },
  chapterRow: {
    flexDirection: 'row',
    gap: 14,
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    alignItems: 'center',
  },
  chapterNum: {
    fontFamily: fonts.display,
    fontSize: 22,
    width: 28,
  },
  chapterName: {
    fontFamily: fonts.bodySemi,
    fontSize: 16,
    marginBottom: 2,
  },
  closeBtn: {
    alignItems: 'center',
    paddingTop: 16,
  },
});
