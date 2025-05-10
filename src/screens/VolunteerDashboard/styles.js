import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  tab: {
    flex: 1,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#2196F3',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#757575',
  },
  activeTabText: {
    color: '#2196F3',
    fontWeight: '700',
  },
  badge: {
    backgroundColor: '#F44336',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 5,
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
    paddingHorizontal: 5,
  },
  listContainer: {
    padding: 16,
  },
  requestCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  requestHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  requestTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
  },
  urgencyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginLeft: 8,
  },
  urgencyText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  requestDescription: {
    fontSize: 14,
    color: '#555',
    marginBottom: 12,
  },
  requestDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
    marginBottom: 4,
  },
  detailText: {
    fontSize: 12,
    color: '#555',
    marginLeft: 4,
  },
  matchContainer: {
    marginBottom: 12,
  },
  matchText: {
    fontSize: 12,
    color: '#555',
    marginBottom: 4,
  },
  matchBar: {
    height: 4,
    backgroundColor: '#E0E0E0',
    borderRadius: 2,
    overflow: 'hidden',
  },
  matchFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
  },
  actionButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 4,
    paddingVertical: 10,
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 16,
    color: '#757575',
    textAlign: 'center',
  },
});