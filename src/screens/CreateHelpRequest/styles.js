import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 20,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  placeholder: {
    width: 24,
  },
  content: {
    flex: 1,
  },
  formContainer: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e3c72',
    marginTop: 20,
    marginBottom: 15,
  },
  inputContainer: {
    marginBottom: 15,
  },
  inputLabel: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
  },
  input: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  textArea: {
    height: 120,
    textAlignVertical: 'top',
  },
  requestTypeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  requestTypeButton: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  activeRequestTypeButton: {
    backgroundColor: '#1e3c72',
    borderColor: '#1e3c72',
  },
  requestTypeText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#333',
  },
  activeRequestTypeText: {
    color: 'white',
  },
  urgencyContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  urgencyButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  lowUrgencyButton: {
    backgroundColor: '#2ecc71',
    borderColor: '#2ecc71',
  },
  normalUrgencyButton: {
    backgroundColor: '#f39c12',
    borderColor: '#f39c12',
  },
  highUrgencyButton: {
    backgroundColor: '#e74c3c',
    borderColor: '#e74c3c',
  },
  urgencyButtonText: {
    fontSize: 16,
    color: '#333',
  },
  activeUrgencyButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  mapContainer: {
    height: 250,
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 10,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  mapPlaceholder: {
    height: 250,
    borderRadius: 10,
    backgroundColor: '#eee',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  loadingText: {
    marginTop: 10,
    color: '#666',
  },
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  addressText: {
    flex: 1,
    marginLeft: 10,
    fontSize: 14,
    color: '#333',
  },
  mapInstructions: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
    marginBottom: 20,
  },
  submitButton: {
    backgroundColor: '#ff5722',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 30,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default styles;