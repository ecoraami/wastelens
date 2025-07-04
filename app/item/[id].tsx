import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, router } from 'expo-router';
import { ArrowLeft, Trash2, Package, Weight, Calendar, Recycle, Leaf, MapPin, Sparkles, ExternalLink } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useItems } from '@/contexts/ItemsContext';
import { useTheme } from '@/contexts/ThemeContext';
import { WasteType } from '@/types/waste';
import { MapsService } from '@/services/maps';

const wasteTypeColors: Record<WasteType, string> = {
  [WasteType.FOOD]: '#f59e0b',
  [WasteType.PLASTIC]: '#3b82f6',
  [WasteType.PAPER]: '#8b5cf6',
  [WasteType.GLASS]: '#06b6d4',
  [WasteType.METAL]: '#6b7280',
  [WasteType.ELECTRONIC]: '#ef4444',
  [WasteType.TEXTILE]: '#ec4899',
  [WasteType.ORGANIC]: '#10b981',
  [WasteType.HAZARDOUS]: '#dc2626',
  [WasteType.PLASTIC_FILM]: '#3b82f6',
  [WasteType.BATTERIES]: '#dc2626',
  [WasteType.LIGHT_BULBS]: '#f59e0b',
  [WasteType.PAINT]: '#dc2626',
  [WasteType.CERAMICS]: '#8b5cf6',
  [WasteType.CHIP_BAGS]: '#64748b',
  [WasteType.OTHER]: '#64748b',
};

export default function ItemDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { items, removeItem } = useItems();
  const { theme } = useTheme();

  const item = items.find(item => item.id === id);

  if (!item) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, { color: theme.colors.text }]}>Item not found</Text>
          <TouchableOpacity 
            style={[styles.backButton, { backgroundColor: theme.colors.primary }]} 
            onPress={() => router.back()}
          >
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const handleDelete = () => {
    Alert.alert(
      'Delete Item',
      'Are you sure you want to delete this item? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => {
            removeItem(item.id);
            router.back();
          }
        }
      ]
    );
  };

  const handleMapSuggestionPress = async (mapSuggestion: any) => {
    try {
      console.log('🗺️ [ItemDetailScreen] Opening map suggestion:', mapSuggestion.searchQuery);
      await MapsService.openMapSuggestion(mapSuggestion);
    } catch (error) {
      console.error('❌ [ItemDetailScreen] Error opening maps:', error);
      Alert.alert(
        'Unable to Open Maps',
        'Could not open the maps application. Please search for the location manually.',
        [{ text: 'OK' }]
      );
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getItemName = () => {
    if (item.description) {
      return item.description;
    }
    return item.type.charAt(0).toUpperCase() + item.type.slice(1);
  };

  const getScoreColor = (score: number) => {
    if (score >= 7) return '#10b981';
    if (score >= 4) return '#f59e0b';
    return '#ef4444';
  };

  const getScoreGradient = (score: number) => {
    if (score >= 7) return ['#10b981', '#059669'];
    if (score >= 4) return ['#f59e0b', '#d97706'];
    return ['#ef4444', '#dc2626'];
  };

  const renderSuggestionWithMapButton = (suggestion: string, index: number) => {
    const mapSuggestion = item.aiAnalysis?.mapSuggestions?.find(ms => ms.text === suggestion);
    
    return (
      <View key={index} style={styles.suggestionItem}>
        <View style={[styles.suggestionDot, { backgroundColor: theme.colors.primary }]} />
        <View style={styles.suggestionContent}>
          <Text style={[styles.suggestionText, { color: theme.colors.textSecondary }]}>
            {suggestion}
          </Text>
          {mapSuggestion && (
            <TouchableOpacity
              style={[styles.mapButton, { backgroundColor: theme.colors.primary }]}
              onPress={() => handleMapSuggestionPress(mapSuggestion)}
            >
              <MapPin size={14} color={theme.colors.surface} />
              <Text style={[styles.mapButtonText, { color: theme.colors.surface }]}>Open in Maps</Text>
              <ExternalLink size={12} color={theme.colors.surface} />
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.colors.surface, borderBottomColor: theme.colors.border }]}>
        <TouchableOpacity style={styles.headerButton} onPress={() => router.back()}>
          <ArrowLeft size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>Item Details</Text>
        <TouchableOpacity style={styles.headerButton} onPress={handleDelete}>
          <Trash2 size={24} color="#ef4444" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Image Section */}
        <View style={styles.imageContainer}>
          {item.imageUrl ? (
            <Image source={{ uri: item.imageUrl }} style={styles.image} />
          ) : (
            <View style={[styles.placeholderImage, { backgroundColor: wasteTypeColors[item.type] + '20' }]}>
              <Text style={[styles.placeholderText, { color: wasteTypeColors[item.type] }]}>
                {item.type.charAt(0).toUpperCase()}
              </Text>
            </View>
          )}
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.3)']}
            style={styles.imageOverlay}
          />
        </View>

        {/* Content */}
        <View style={[styles.content, { backgroundColor: theme.colors.surface }]}>
          {/* Item Header */}
          <View style={styles.itemHeader}>
            <Text style={[styles.itemName, { color: theme.colors.text }]}>{getItemName()}</Text>
            <View style={[styles.typeBadge, { backgroundColor: wasteTypeColors[item.type] + '20' }]}>
              <Text style={[styles.typeText, { color: wasteTypeColors[item.type] }]}>
                {item.type.toUpperCase()}
              </Text>
            </View>
          </View>

          {/* Properties */}
          <View style={styles.propertiesContainer}>
            {item.recyclable && (
              <View style={[styles.propertyBadge, styles.recyclableBadge]}>
                <Recycle size={16} color="#10b981" />
                <Text style={styles.recyclableText}>Recycling Bin</Text>
              </View>
            )}
            {item.compostable && (
              <View style={[styles.propertyBadge, styles.compostableBadge]}>
                <Leaf size={16} color="#f59e0b" />
                <Text style={styles.compostableText}>Compostable</Text>
              </View>
            )}
            {!item.recyclable && !item.compostable && (
              <View style={[styles.propertyBadge, styles.specialBadge]}>
                <Text style={styles.specialText}>Special Handling</Text>
              </View>
            )}
          </View>

          {/* Details Grid */}
          <View style={styles.detailsGrid}>
            <View style={[styles.detailCard, { backgroundColor: theme.colors.background }]}>
              <View style={styles.detailHeader}>
                <Weight size={20} color={theme.colors.primary} />
                <Text style={[styles.detailLabel, { color: theme.colors.textSecondary }]}>Weight</Text>
              </View>
              <Text style={[styles.detailValue, { color: theme.colors.text }]}>{item.weight}g</Text>
            </View>

            <View style={[styles.detailCard, { backgroundColor: theme.colors.background }]}>
              <View style={styles.detailHeader}>
                <Package size={20} color={theme.colors.primary} />
                <Text style={[styles.detailLabel, { color: theme.colors.textSecondary }]}>Quantity</Text>
              </View>
              <Text style={[styles.detailValue, { color: theme.colors.text }]}>1 item</Text>
            </View>

            <View style={[styles.detailCard, { backgroundColor: theme.colors.background }]}>
              <View style={styles.detailHeader}>
                <Calendar size={20} color={theme.colors.primary} />
                <Text style={[styles.detailLabel, { color: theme.colors.textSecondary }]}>Date</Text>
              </View>
              <Text style={[styles.detailValue, { color: theme.colors.text }]}>{formatDate(item.timestamp)}</Text>
              <Text style={[styles.detailSubvalue, { color: theme.colors.textTertiary }]}>{formatTime(item.timestamp)}</Text>
            </View>

            {item.location && (
              <View style={[styles.detailCard, { backgroundColor: theme.colors.background }]}>
                <View style={styles.detailHeader}>
                  <MapPin size={20} color={theme.colors.primary} />
                  <Text style={[styles.detailLabel, { color: theme.colors.textSecondary }]}>Location</Text>
                </View>
                <Text style={[styles.detailValue, { color: theme.colors.text }]}>{item.location}</Text>
              </View>
            )}
          </View>

          {/* AI Analysis Section - Only show if available */}
          {item.aiAnalysis && (
            <>
              {/* Environment Score */}
              <View style={styles.scoreSection}>
                <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Environmental Score</Text>
                <View style={[styles.scoreCard, { backgroundColor: theme.colors.background }]}>
                  <View style={styles.scoreHeader}>
                    <Sparkles size={20} color={getScoreColor(item.aiAnalysis.environmentScore)} />
                    <Text style={[styles.scoreTitle, { color: theme.colors.text }]}>Environment Score</Text>
                    <Text style={[styles.scoreValue, { color: getScoreColor(item.aiAnalysis.environmentScore) }]}>
                      {item.aiAnalysis.environmentScore}/10
                    </Text>
                  </View>
                  <View style={[styles.scoreBarContainer, { backgroundColor: theme.colors.border }]}>
                    <LinearGradient
                      colors={getScoreGradient(item.aiAnalysis.environmentScore)}
                      style={[styles.scoreBar, { width: `${item.aiAnalysis.environmentScore * 10}%` }]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                    />
                  </View>
                </View>
              </View>

              {/* Smart Disposal Guide - Show saved AI recommendations */}
              <View style={styles.disposalSection}>
                <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Smart Disposal Guide</Text>
                <View style={[styles.disposalCard, { backgroundColor: theme.colors.background }]}>
                  {item.aiAnalysis.suggestions.map((suggestion, index) => 
                    renderSuggestionWithMapButton(suggestion, index)
                  )}
                </View>
              </View>
            </>
          )}

          {/* Environmental Impact */}
          <View style={styles.impactSection}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Environmental Impact</Text>
            <View style={[styles.impactCard, { backgroundColor: theme.colors.background }]}>
              <View style={styles.impactRow}>
                <Text style={[styles.impactLabel, { color: theme.colors.textSecondary }]}>Category</Text>
                <Text style={[styles.impactValue, { color: theme.colors.text }]}>
                  {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
                </Text>
              </View>
              <View style={styles.impactRow}>
                <Text style={[styles.impactLabel, { color: theme.colors.textSecondary }]}>CO₂ Impact</Text>
                <Text style={[styles.impactValue, { color: theme.colors.success }]}>
                  {item.aiAnalysis ? 
                    `${item.aiAnalysis.carbonFootprint}kg saved` : 
                    `${(item.weight * 0.0005).toFixed(3)}kg saved`
                  }
                </Text>
              </View>
              <View style={styles.impactRow}>
                <Text style={[styles.impactLabel, { color: theme.colors.textSecondary }]}>Material</Text>
                <Text style={[styles.impactValue, { color: theme.colors.text }]}>
                  {item.aiAnalysis?.material || 'Mixed Material'}
                </Text>
              </View>
              <View style={styles.impactRow}>
                <Text style={[styles.impactLabel, { color: theme.colors.textSecondary }]}>Disposal Method</Text>
                <Text style={[styles.impactValue, { color: theme.colors.text }]}>
                  {item.recyclable ? 'Recycling Bin' : item.compostable ? 'Compost Bin' : 'Special Handling'}
                </Text>
              </View>
            </View>
          </View>

          {/* General Tips Section - Only show if no AI analysis */}
          {!item.aiAnalysis && (
            <View style={styles.tipsSection}>
              <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Disposal Tips</Text>
              <View style={[styles.tipsCard, { backgroundColor: theme.colors.background }]}>
                {item.recyclable && (
                  <View style={styles.tipItem}>
                    <View style={[styles.tipBullet, { backgroundColor: theme.colors.success }]} />
                    <Text style={[styles.tipText, { color: theme.colors.textSecondary }]}>
                      Clean the item before placing in recycling bin
                    </Text>
                  </View>
                )}
                {item.compostable && (
                  <View style={styles.tipItem}>
                    <View style={[styles.tipBullet, { backgroundColor: theme.colors.warning }]} />
                    <Text style={[styles.tipText, { color: theme.colors.textSecondary }]}>
                      Add to compost bin or home composting system
                    </Text>
                  </View>
                )}
                <View style={styles.tipItem}>
                  <View style={[styles.tipBullet, { backgroundColor: theme.colors.primary }]} />
                  <Text style={[styles.tipText, { color: theme.colors.textSecondary }]}>
                    Check local waste management guidelines for specific disposal rules
                  </Text>
                </View>
                <View style={styles.tipItem}>
                  <View style={[styles.tipBullet, { backgroundColor: theme.colors.primary }]} />
                  <Text style={[styles.tipText, { color: theme.colors.textSecondary }]}>
                    Consider reusable alternatives for future purchases
                  </Text>
                </View>
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  errorText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    marginBottom: 24,
  },
  backButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  backButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  headerButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
  },
  scrollView: {
    flex: 1,
  },
  imageContainer: {
    position: 'relative',
    height: 300,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  placeholderImage: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontFamily: 'Inter-Bold',
    fontSize: 64,
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
  },
  content: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -24,
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 40,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  itemName: {
    fontFamily: 'Inter-Bold',
    fontSize: 28,
    flex: 1,
    marginRight: 16,
  },
  typeBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  typeText: {
    fontFamily: 'Inter-Bold',
    fontSize: 12,
  },
  propertiesContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 32,
  },
  propertyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
  },
  recyclableBadge: {
    backgroundColor: '#dcfce7',
  },
  recyclableText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#10b981',
  },
  compostableBadge: {
    backgroundColor: '#fef3c7',
  },
  compostableText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#f59e0b',
  },
  specialBadge: {
    backgroundColor: '#e0e7ff',
  },
  specialText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#3b82f6',
  },
  detailsGrid: {
    gap: 16,
    marginBottom: 32,
  },
  detailCard: {
    borderRadius: 16,
    padding: 20,
  },
  detailHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  detailLabel: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
  },
  detailValue: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    marginBottom: 4,
  },
  detailSubvalue: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
  },
  scoreSection: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    marginBottom: 16,
  },
  scoreCard: {
    borderRadius: 16,
    padding: 20,
  },
  scoreHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  scoreTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    marginLeft: 8,
    flex: 1,
  },
  scoreValue: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
  },
  scoreBarContainer: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  scoreBar: {
    height: '100%',
    borderRadius: 4,
  },
  disposalSection: {
    marginBottom: 32,
  },
  disposalCard: {
    borderRadius: 16,
    padding: 20,
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  suggestionDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginTop: 6,
    marginRight: 12,
  },
  suggestionContent: {
    flex: 1,
  },
  suggestionText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
  },
  mapButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  mapButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 12,
  },
  impactSection: {
    marginBottom: 32,
  },
  impactCard: {
    borderRadius: 16,
    padding: 20,
    gap: 16,
  },
  impactRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  impactLabel: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
  },
  impactValue: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
  },
  tipsSection: {
    marginBottom: 32,
  },
  tipsCard: {
    borderRadius: 16,
    padding: 20,
    gap: 16,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  tipBullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginTop: 6,
  },
  tipText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    flex: 1,
    lineHeight: 20,
  },
});