<script setup lang="js">
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { supabase } from '../lib/supabaseClient'

const route = useRoute()
let user = ref('')
let userId = ref(route.params.id)
let loading = ref(true)
let projects = ref([])

const fetchProjects = async () => {
    console.log("Is teacher: " + user.value.is_teacher)
    if(!user.value.is_teacher){
        try {
        // Fetch user projects
        let { data: userProjects, error: userProjectsError } = await supabase
            .from('users_projects')
            .select('project_id')
            .eq('user_id', user.value.id)
    
        if (userProjectsError) throw userProjectsError

        console.log('User Projects:', userProjects)
    
        // Extract project IDs
        const projectIds = userProjects.map(up => up.project_id)
    
        // Fetch project details
        let { data: projectsData, error: projectsError } = await supabase
            .from('projects')
            .select('id, title, subject')
            .in('id', projectIds)
    
        if (projectsError) throw projectsError

        console.log('Projects Data:', projectsData)
    
        // Store projects in data
        projects.value = projectsData
        } catch (error) {
        console.error('Error fetching projects:', error)
        }
    }
    else{
        try {
            // Fetch projects created by the teacher
            let { data: teacherProjects, error: teacherProjectsError } = await supabase
                .from('projects')
                .select('id, title, subject')
                .eq('id_owner', user.value.id);
            
            if (teacherProjectsError) throw teacherProjectsError;

            console.log('Teacher Projects:', teacherProjects);

            // Store projects in data
            projects.value = teacherProjects;
        } catch (error) {
            console.error('Error fetching teacher projects:', error);
        }
    }
}

const fetchUserById = async (id) => {
  try {
    let { data: userProfile, error: userProfileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', id)
      .single()

    if (userProfileError) throw userProfileError

    console.log('User Profile:', userProfile)
    user.value = userProfile

    await fetchProjects()

  } catch (error) {
    console.error('Error fetching user profile:', error)
  }
}


  
onMounted(async () => {
    await fetchUserById(userId.value)
   
    loading.value = false
})
</script>

<style>
@media (max-width: 768px) {
  .custom-div-2,
  .custom-div-5 {
    width: 94%;
    margin-top: 10px;
    margin-bottom: 10px;
    margin-left: 3%;
  }
}

@media (min-width: 769px) {
  .grid {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
  }

  .custom-div-2 {
    grid-column: span 2;
    margin-right: 10px;
    margin-left: 10px;
  }
  .custom-div-5 {
    grid-column: span 5;
    margin-right: 10px;
  }
}
</style>

<template>
    <div class="bg-gray-100 container mx-auto py-8">          
            <div class="grid">
                <div class="custom-div-2 bg-white shadow rounded-lg p-6 flex flex-col items-center">
                    <div class="flex flex-col items-center">
                        <!--
                        <img src="https://images.unsplash.com/photo-1528892952291-009c663ce843?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=296&q=80" class="w-32 h-32 bg-gray-300 rounded-full shrink-0 object-cover">
                        -->
                        <img :src="`https://api.dicebear.com/9.x/bottts-neutral/svg?seed=${user.id}&radius=50&randomizeIds=true`" class="w-32 h-32 bg-gray-300 rounded-full shrink-0 object-cover">

                            
                        </div>               
                    <div class="flex flex-col">
                        <span class="text-gray-600 text-center font-bold tracking-wider my-3 text-2xl">{{ user.username }}</span>
                        <hr class="border-b-2 border-gray-300">
                        <div class="flex items-center gap-4 mt-4">
                            <div class="flex flex-col items-center">
                                <span class="text-center font-bold mb-2">NOVA University</span>
                            </div>
                            <div class="border-l-2 border-gray-300 h-full"></div>
                            <div class="flex flex-col items-center">
                            <ul>
                                <li class="text-center font-bold mb-2">Master in</li>
                                <li class="text-center">Computer Science</li>
                            </ul>
                            </div>
                        </div>
                        
                        <hr class="border-b-2 border-gray-300 m-4">
                        
                        <div class="flex flex-col items-center">
                            <span class="text-center font-bold">userEmail@email.com</span>
                        </div>
                        
                    </div>

                    
                </div>
                
                    
                <div class="custom-div-5 bg-white shadow rounded-lg p-6 flex flex-col items-center">
                
            <div>
                <div class="bg-white shadow rounded-lg p-6">                

                    <div v-if="!user.is_teacher">

                        <h2 class="text-xl font-bold mb-3">Preferences</h2>
                        <div class="mb-6">
                            <div class="flex justify-between flex-wrap gap-x-10 w-full pr-12">
                                <div>
                                    <span class="text-gray-700 font-bold">Collaborative Style: </span>
                                    <span class="text-gray-700">In-Person</span>
                                </div>
                                <div>
                                    <span class="text-gray-700 font-bold">Work Location: </span>
                                    <span class="text-gray-700">Library, University Campus</span>
                                </div>
                                <div>
                                    <span class="text-gray-700 font-bold">Communications: </span>
                                    <span class="text-gray-700">e-mail, whatsapp</span>
                                </div>       
                            </div>
                        </div>
                            
                        <h2 class="text-xl font-bold mt-8 mb-3">Projects Enrolled:</h2>

                    </div>
                    <div v-else>
                        <h2 class="text-xl font-bold mt-8 mb-3">Lecturing Projects:</h2>
                    </div>

                    <div class="mb-6">
                        <div class="flex flex-col gap-y-4 w-full pr-12">
                            <div v-for="project in projects" :key="project.id" class="w-full">
                                <span class="text-gray-700 font-bold"> -> {{ project.title }} </span>
                                <span class="text-gray-700"> ({{ project.subject }})</span>
                            </div>
                        </div>
                    </div>
                    
                

                    <h2 class="text-xl font-bold mb-4">About Me</h2>
                    <p class="text-gray-700">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed finibus est
                        vitae tortor ullamcorper, ut vestibulum velit convallis. Aenean posuere risus non velit egestas
                        suscipit. Nunc finibus vel ante id euismod. Vestibulum ante ipsum primis in faucibus orci luctus
                        et ultrices posuere cubilia Curae; Aliquam erat volutpat. Nulla vulputate pharetra tellus, in
                        luctus risus rhoncus id.
                    </p>


                </div>
            </div>
            </div>
        </div>
    </div>
</template>
