import { Field, Button, Form, Textarea, Checkbox, ToggleGroup, ErrorMessage } from '@dropbroker/ui'
import AddressAutocomplete from '../components/AddressAutocomplete'
import ImageUpload from '../components/ImageUpload'
import type { PropertyType, FurnishedStatus } from '../types/property'
import { PROPERTY_TYPE_OPTIONS, FURNISHED_OPTIONS } from '../constants/property'
import { usePostPropertyForm } from '../hooks/usePostPropertyForm'
import { getApiError } from '../utils/errors'

export default function PostProperty() {
  const { form, errors, images, setImages, isPending, error, handleChange, handleSubmit, setField } = usePostPropertyForm()

  return (
    <div className="ui-page">
      <h1 className="ui-page-heading">Post a Property</h1>
      <p className="ui-page-subtitle">Your listing will be visible after admin approval.</p>

      <Form onSubmit={handleSubmit} noValidate>

        <Field
          label="Title"
          id="title"
          name="title"
          type="text"
          placeholder="e.g. Spacious 2BHK in Koramangala"
          value={form.title}
          onChange={handleChange}
          error={errors.title}
        />

        <ToggleGroup
          label="Property Type"
          options={PROPERTY_TYPE_OPTIONS}
          value={form.type}
          onChange={(val) => setField('type', val as PropertyType)}
          error={errors.type}
        />

        <ToggleGroup
          label="Furnished Status"
          options={FURNISHED_OPTIONS}
          value={form.furnished}
          onChange={(val) => setField('furnished', val as FurnishedStatus)}
          error={errors.furnished}
          stretch
        />

        <AddressAutocomplete
          value={form.address}
          onChange={(val) => setField('address', val)}
          onSelect={({ formattedAddress, city, locality }) => {
            setField('address', formattedAddress)
            setField('city', city)
            setField('locality', locality)
          }}
          error={errors.address}
        />

        <div className="ui-grid-2">
          <Field
            label="City"
            id="city"
            name="city"
            type="text"
            placeholder="Auto-filled from address"
            value={form.city}
            onChange={handleChange}
            error={errors.city}
          />
          <Field
            label="Locality"
            id="locality"
            name="locality"
            type="text"
            placeholder="Auto-filled from address"
            value={form.locality}
            onChange={handleChange}
            error={errors.locality}
          />
        </div>

        <Field
          label="Monthly Rent (₹)"
          id="price"
          name="price"
          type="number"
          placeholder="e.g. 25000"
          value={form.price}
          onChange={handleChange}
          error={errors.price}
        />

        <div className="ui-grid-3">
          <Field
            label="Area (sq ft)"
            id="areaSqft"
            name="areaSqft"
            type="number"
            placeholder="e.g. 900"
            value={form.areaSqft}
            onChange={handleChange}
          />
          <Field
            label="Floor"
            id="floor"
            name="floor"
            type="number"
            placeholder="e.g. 3"
            value={form.floor}
            onChange={handleChange}
          />
          <Field
            label="Total Floors"
            id="totalFloors"
            name="totalFloors"
            type="number"
            placeholder="e.g. 10"
            value={form.totalFloors}
            onChange={handleChange}
          />
        </div>

        <Field
          label="Available From"
          id="availableFrom"
          name="availableFrom"
          type="date"
          value={form.availableFrom}
          onChange={handleChange}
        />

        <Checkbox
          id="parking"
          name="parking"
          label="Parking available"
          checked={form.parking}
          onChange={handleChange}
        />

        <ImageUpload
          files={images}
          onChange={setImages}
        />

        <Textarea
          label="Description (optional)"
          id="description"
          name="description"
          rows={4}
          placeholder="Describe the property…"
          value={form.description}
          onChange={handleChange}
        />

        <ErrorMessage>
          {error ? getApiError(error, 'Failed to post property') : ''}
        </ErrorMessage>

        <Button type="submit" block loading={isPending}>
          Post Property
        </Button>

      </Form>
    </div>
  )
}
