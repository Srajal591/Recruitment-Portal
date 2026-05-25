import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'

import {
  FileText,
  Calendar,
  Plus,
  Loader2,
  Sparkles,
} from 'lucide-react'

import AdminLayout from '../../components/layouts/AdminLayout'
import {
  Card,
  CardContent,
  CardHeader,
} from '../../components/ui/Card'

import Button from '../../components/ui/Button'
import { adminService } from '../../services/admin.service'

const STATES = [
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chhattisgarh',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
]

const CreateProject = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const [formData, setFormData] = useState({
    name: '',
    state: 'Bihar',
    department: '',
    description: '',
    startDate: '',
    endDate: '',
  })

  const [errors, setErrors] = useState({})

  const { mutate: createProject, isPending } =
    useMutation({
      mutationFn: adminService.createProject,

      onSuccess: () => {
        toast.success('Project created successfully')

        queryClient.invalidateQueries({
          queryKey: ['admin-projects'],
        })

        navigate('/admin/projects')
      },

      onError: (err) => {
        toast.error(
          err.message || 'Failed to create project'
        )
      },
    })

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))

    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: '',
      }))
    }
  }

  const validate = () => {
    const newErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Project name is required'
    }

    if (!formData.department.trim()) {
      newErrors.department =
        'Department is required'
    }

    if (
      formData.startDate &&
      formData.endDate &&
      formData.endDate < formData.startDate
    ) {
      newErrors.endDate =
        'End date must be after start date'
    }

    setErrors(newErrors)

    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = () => {
    if (!validate()) return

    createProject({
      ...formData,
    })
  }

  return (
    <AdminLayout title="Create Project">
      <div className="min-h-screen bg-[#f7f4ee] p-5">

        {/* HEADER */}
        <div className="mb-6">

          <p className="text-[10px] font-black tracking-[0.2em] text-orange-500 mb-2">
            PROJECT CREATION
          </p>

          <h1 className="text-3xl font-black text-[#1f2937]">
            Create Project
          </h1>

          <p className="text-sm text-gray-500 mt-1">
            Set up a new recruitment drive
            or administrative project.
          </p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">

          {/* MAIN */}
          <div className="xl:col-span-2 space-y-5">

            {/* BASIC INFO */}
            <Card className="
              rounded-[24px]
              bg-white/90 backdrop-blur-xl
              border border-white/70
              shadow-[0_6px_24px_rgba(0,0,0,0.04)]
            ">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <div className="
                    w-10 h-10 rounded-2xl
                    bg-orange-100
                    flex items-center justify-center
                  ">
                    <FileText className="w-5 h-5 text-orange-600" />
                  </div>

                  <div>
                    <h3 className="font-black text-[#1f2937]">
                      Basic Information
                    </h3>

                    <p className="text-xs text-gray-500">
                      Project details & department info
                    </p>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-5">

                <div>
                  <label className="text-sm font-semibold text-gray-700 block mb-2">
                    Project Name
                  </label>

                  <input
                    type="text"
                    placeholder="e.g Bihar Police Recruitment 2026"
                    value={formData.name}
                    onChange={(e) =>
                      handleChange(
                        'name',
                        e.target.value
                      )
                    }
                    className="
                      w-full h-12 px-4
                      rounded-2xl
                      border border-gray-200
                      bg-[#fafafa]
                      focus:outline-none
                      focus:ring-2
                      focus:ring-orange-500
                    "
                  />

                  {errors.name && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.name}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                  <div>
                    <label className="text-sm font-semibold text-gray-700 block mb-2">
                      State
                    </label>

                    <select
                      value={formData.state}
                      onChange={(e) =>
                        handleChange(
                          'state',
                          e.target.value
                        )
                      }
                      className="
                        w-full h-12 px-4
                        rounded-2xl
                        border border-gray-200
                        bg-[#fafafa]
                        focus:outline-none
                        focus:ring-2
                        focus:ring-orange-500
                      "
                    >
                      {STATES.map((s) => (
                        <option
                          key={s}
                          value={s}
                        >
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-gray-700 block mb-2">
                      Department
                    </label>

                    <input
                      type="text"
                      placeholder="e.g Home Affairs"
                      value={formData.department}
                      onChange={(e) =>
                        handleChange(
                          'department',
                          e.target.value
                        )
                      }
                      className="
                        w-full h-12 px-4
                        rounded-2xl
                        border border-gray-200
                        bg-[#fafafa]
                        focus:outline-none
                        focus:ring-2
                        focus:ring-orange-500
                      "
                    />

                    {errors.department && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.department}
                      </p>
                    )}
                  </div>

                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-700 block mb-2">
                    Description
                  </label>

                  <textarea
                    rows="5"
                    placeholder="Describe the purpose and scope of this project..."
                    value={formData.description}
                    onChange={(e) =>
                      handleChange(
                        'description',
                        e.target.value
                      )
                    }
                    className="
                      w-full px-4 py-4
                      rounded-2xl
                      border border-gray-200
                      bg-[#fafafa]
                      resize-none
                      focus:outline-none
                      focus:ring-2
                      focus:ring-orange-500
                    "
                  />
                </div>

              </CardContent>
            </Card>

            {/* ACTIONS */}
            <div className="flex items-center justify-between">

              <Button
                variant="outline"
                onClick={() =>
                  navigate('/admin/projects')
                }
                className="
                  rounded-2xl h-11 px-6
                "
              >
                Cancel
              </Button>

              <Button
                onClick={handleSubmit}
                disabled={isPending}
                className="
                  bg-orange-600 hover:bg-orange-700
                  text-white rounded-2xl
                  h-11 px-6
                  shadow-lg shadow-orange-200
                "
              >
                {isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 mr-2" />
                    Create Project
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* SIDEBAR */}
          <div className="space-y-5">

            {/* TIMELINE */}
            <Card className="
              rounded-[24px]
              bg-white/90 backdrop-blur-xl
              border border-white/70
              shadow-[0_6px_24px_rgba(0,0,0,0.04)]
            ">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-orange-600" />

                  <h3 className="font-black text-[#1f2937]">
                    Timeline
                  </h3>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">

                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-2">
                    Start Date
                  </label>

                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) =>
                      handleChange(
                        'startDate',
                        e.target.value
                      )
                    }
                    className="
                      w-full h-11 px-4
                      rounded-2xl
                      border border-gray-200
                      bg-[#fafafa]
                    "
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-2">
                    End Date
                  </label>

                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) =>
                      handleChange(
                        'endDate',
                        e.target.value
                      )
                    }
                    className="
                      w-full h-11 px-4
                      rounded-2xl
                      border border-gray-200
                      bg-[#fafafa]
                    "
                  />
                </div>

              </CardContent>
            </Card>

            {/* INFO CARD */}
            <div className="
              rounded-[24px]
              overflow-hidden
              relative
              bg-gradient-to-br
              from-[#2b1c16]
              to-[#6f3e25]
              p-5 text-white
              min-h-[220px]
            ">

              <div className="absolute inset-0 bg-black/20" />

              <div className="relative z-10">

                <div className="
                  w-12 h-12 rounded-2xl
                  bg-white/10
                  flex items-center justify-center
                  mb-4
                ">
                  <Sparkles className="w-5 h-5" />
                </div>

                <h3 className="text-lg font-black">
                  State Compliance
                </h3>

                <p className="text-sm text-white/80 mt-2 leading-relaxed">
                  Ensure all project details align with
                  Bihar recruitment board standards and
                  state-level guidelines.
                </p>

              </div>
            </div>

          </div>
        </div>
      </div>
    </AdminLayout>
  )
}

export default CreateProject