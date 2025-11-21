# Reports Page Updates

## Changes Made

### 1. Disease Type Field Changed from Dropdown to Text Input

**Before:**
- Had a dropdown/select element that fetched diseases from the API
- Required selecting from predefined disease types
- Had both `disease_id` (dropdown) and `disease_name_custom` (optional text input)

**After:**
- Single text input field for disease name
- Users can freely type any disease name
- Simplified form with just `disease_name` field
- More flexible for farmers to report any disease

### 2. Location Pinning Already Working

The map click functionality was **already implemented** and working:
- Users can click anywhere on the map to set their location
- The `handleMapClick(lat, lng)` function captures the coordinates
- Reverse geocoding automatically fetches the address using OpenStreetMap Nominatim API
- Location is displayed in the form with the full address
- A pin marker shows the selected location on the map

### Implementation Details

#### Form State Changes
```javascript
// OLD formData
const [formData, setFormData] = useState({
    disease_id: '',
    disease_name_custom: '',
    animal_name: '',
    description: '',
    image: null,
});

// NEW formData
const [formData, setFormData] = useState({
    disease_name: '',
    animal_name: '',
    description: '',
    image: null,
});
```

#### Form Submission
```javascript
// Sends disease_name as disease_name_custom to backend
submitData.append('disease_id', 1); // Default disease ID
submitData.append('disease_name_custom', formData.disease_name);
submitData.append('animal_name', formData.animal_name);
submitData.append('description', formData.description);
submitData.append('address', address);
submitData.append('latitude', location.lat);
submitData.append('longitude', location.lng);
```

#### New Disease Name Input Field
```jsx
<div>
    <label className="block text-sm font-medium text-gray-700 mb-2">
        Disease Name *
    </label>
    <input
        type="text"
        placeholder="Enter disease name (e.g., Foot and Mouth Disease, Bird Flu)"
        value={formData.disease_name}
        onChange={(e) => setFormData({ ...formData, disease_name: e.target.value })}
        className="w-full px-4 py-2 bg-white text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
        required
    />
</div>
```

#### Map Integration (Already Working)
```jsx
<MapView
    markers={mapMarkers}
    onMarkerClick={handleMarkerClick}
    onMapClick={handleMapClick}  // ✅ Click handler for pinning location
    markerType="pin"
    center={[location.lat, location.lng]}
/>

const handleMapClick = (lat, lng) => {
    setLocation({ lat, lng });
    getAddressFromCoords(lat, lng);  // Reverse geocoding
};
```

### Files Modified
- `frontend-react/src/pages/user/Reports.jsx` - Updated form fields and removed dropdown

### UI Improvements
1. ✅ Simplified disease entry - single text input instead of dropdown
2. ✅ Better user experience - no need to scroll through predefined options
3. ✅ More flexible - farmers can report any disease name
4. ✅ Location pinning works - click anywhere on map to set location
5. ✅ Address display - shows full address from reverse geocoding
6. ✅ Visual feedback - pin marker shows selected location

### How to Use
1. **Enter Disease Name**: Type any disease name in the text input field
2. **Enter Animal Name**: Type the affected animal's name
3. **Enter Description**: Describe the symptoms
4. **Pin Location**: Click anywhere on the map to set the exact location
   - The address will automatically update
   - A pin marker will show your selected location
5. **Upload Image** (Optional): Select an image file
6. **Submit**: Click "Submit Report" button

### Backend Compatibility
- Still sends `disease_id` with default value of `1`
- Sends disease name as `disease_name_custom` to maintain backend compatibility
- No backend changes required - existing API endpoints work as is
