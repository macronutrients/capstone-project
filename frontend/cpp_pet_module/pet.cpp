#include "pet.hpp"
#include <iostream>

    //Pet::Pet() : name_(""), star_unlock_(0) {}

    Pet::Pet(std::string name, int star_unlock) : name_(name), star_unlock_(star_unlock)
    {

    }

    std::string Pet::getName()
    {
        return name_;
    }

    void Pet::setName(std::string name)
    {
        name_ = name;
    }

    int Pet::getStarUnlock()
    {
        return star_unlock_;
    }

    void Pet::setStarUnlock(int star_unlock)
    {
        star_unlock_ = star_unlock;
    }

    bool Pet::enoughStars(int star_count)
    {
        if (star_count >= star_unlock_)
        {
            std::cout << "Pet Unlocked" << std::endl;
            return true;
        }

        else
        {
            std::cout << "Sorry, you must have " << star_unlock_ << " stars to unlock " << std::endl;
            return false;
        }

    }