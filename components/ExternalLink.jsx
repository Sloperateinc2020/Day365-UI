import React from 'react';
import { useColorScheme, Text } from 'react-native';
import { useAnimatedRef, useScrollViewOffset, useAnimatedStyle } from 'react-native-reanimated';
import Animated from 'react-native-reanimated';

export default function ParallaxScrollView() {
  const colorScheme = useColorScheme() ?? 'light';

  // Remove TypeScript generic <Animated.ScrollView> for compatibility in JavaScript
  const scrollRef = useAnimatedRef(); // No generic in JavaScript
  const scrollOffset = useScrollViewOffset(scrollRef);

  const headerAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: scrollOffset.value > 100 ? 0 : 1,
    };
  });

  return (
    <Animated.ScrollView ref={scrollRef}>
      {/* Parallax Header */}
      <Animated.View style={headerAnimatedStyle}>
        <Text style={{ fontSize: 24 }}>This is a parallax header</Text>
      </Animated.View>

      {/* Scrollable content */}
      <Text style={{ fontSize: 18, padding: 10 }}>Scroll down for more content...</Text>
      <Text style={{ fontSize: 18, padding: 10 }}>More content...</Text>
      <Text style={{ fontSize: 18, padding: 10 }}>Even more content...</Text>
    </Animated.ScrollView>
  );
}
