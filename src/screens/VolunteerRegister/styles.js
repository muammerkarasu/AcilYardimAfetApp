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
    marginBottom: 10,
  },
  sectionDescription: {
    fontSize: 14,
    color: '#666',
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
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  skillButton: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  activeSkillButton: {
    backgroundColor: '#1e3c72',
    borderColor: '#1e3c72',
  },
  skillText: {
    marginLeft: 10,
    fontSize: 14,
    color: '#333',
  },
  activeSkillText: {
    color: 'white',
  },
  availabilityContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  availabilityButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 12,
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  activeAvailabilityButton: {
    backgroundColor: '#1e3c72',
    borderColor: '#1e3c72',
  },
  availabilityText: {
    fontSize: 14,
    color: '#333',
  },
  activeAvailabilityText: {
    color: 'white',
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  switchLabel: {
    fontSize: 16,
    color: '#333',
  },
  locationContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  locationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  locationText: {
    flex: 1,
    fontSize: 14,
    color: '#333',
  },
  locationButton: {
    padding: 5,
  },
  locationDescription: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
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
  travelDistanceContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
    justifyContent: 'space-between',
  },
  travelDistanceButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#1e3c72',
    marginBottom: 10,
    marginRight: 8,
    backgroundColor: 'white',
  },
  activeTravelDistanceButton: {
    backgroundColor: '#1e3c72',
  },
  travelDistanceText: {
    color: '#1e3c72',
    fontWeight: '500',
  },
  activeTravelDistanceText: {
    color: 'white',
  },
});

export default styles;